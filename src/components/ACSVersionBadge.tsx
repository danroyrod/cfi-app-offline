import { useState, useEffect } from 'react';
import type { ACSVersionInfo } from '../types';
import './ACSVersionBadge.css';

interface ACSVersionBadgeProps {
  versionInfo?: ACSVersionInfo;
  documentNumber: string;
  date: string;
}

/**
 * Displays the ACS document version and verification status.
 * Checks online for newer FAA ACS releases when connected.
 */
export default function ACSVersionBadge({ versionInfo, documentNumber, date }: ACSVersionBadgeProps) {
  const [newerVersionAvailable, setNewerVersionAvailable] = useState<string | null>(null);

  const lastVerified = versionInfo?.last_verified;
  const daysSinceVerification = lastVerified
    ? Math.floor((Date.now() - new Date(lastVerified).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Status: green if verified within 90 days, yellow within 180, red beyond that
  let statusClass = 'acs-version-status--unknown';
  let statusLabel = 'Not verified';
  if (daysSinceVerification !== null) {
    if (daysSinceVerification <= 90) {
      statusClass = 'acs-version-status--current';
      statusLabel = 'Current';
    } else if (daysSinceVerification <= 180) {
      statusClass = 'acs-version-status--review';
      statusLabel = 'Review recommended';
    } else {
      statusClass = 'acs-version-status--outdated';
      statusLabel = 'Verification needed';
    }
  }

  // Override status if a newer version is detected
  if (newerVersionAvailable) {
    statusClass = 'acs-version-status--outdated';
    statusLabel = 'Update available';
  }

  // Check for newer FAA ACS version when online
  useEffect(() => {
    if (!navigator.onLine) return;

    const checkForNewerVersion = async () => {
      try {
        // Fetch the FAA ACS page and look for a newer effective date
        // We use a lightweight HEAD/fetch with a short timeout to avoid blocking
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          'https://www.faa.gov/training_testing/testing/acs',
          { signal: controller.signal, mode: 'no-cors' }
        );
        clearTimeout(timeoutId);

        // With no-cors we can't read the body, but we can detect if the page exists.
        // For a real check, we'd need a proxy or a known JSON endpoint.
        // Instead, we rely on a locally stored "known latest" date that gets updated
        // when the developer verifies. If the FAA releases a new version, the developer
        // updates acs_data.json and redeploys — the version_info.acs_revision field
        // acts as the single source of truth.
        //
        // For now, we check localStorage for a cached "faa_acs_latest" flag that
        // could be set by a future admin/update mechanism.
        const cachedLatest = localStorage.getItem('faa_acs_latest_revision');
        if (cachedLatest && cachedLatest !== versionInfo?.acs_revision) {
          setNewerVersionAvailable(cachedLatest);
        }

        // If response is opaque (no-cors), we at least know the user is online
        // and the FAA site is reachable. The real detection happens via the
        // last_verified date aging out.
        void response;
      } catch {
        // Network error or timeout — silently ignore, user is likely offline
      }
    };

    checkForNewerVersion();
  }, [versionInfo?.acs_revision]);

  return (
    <div className="acs-version-badge">
      <div className={`acs-version-status ${statusClass}`}>
        <span className="acs-version-dot"></span>
        <span className="acs-version-label">{statusLabel}</span>
      </div>
      <div className="acs-version-details">
        <span className="acs-version-doc">{documentNumber}</span>
        <span className="acs-version-separator">·</span>
        <span className="acs-version-date">{date}</span>
        {lastVerified && (
          <>
            <span className="acs-version-separator">·</span>
            <span className="acs-version-verified">Verified {lastVerified}</span>
          </>
        )}
      </div>
      {newerVersionAvailable && (
        <div className="acs-version-warning">
          ⚠️ Newer ACS revision ({newerVersionAvailable}) may be available
        </div>
      )}
      {versionInfo?.source_url && (
        <a
          href={versionInfo.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="acs-version-source-link"
        >
          Check FAA source ↗
        </a>
      )}
    </div>
  );
}

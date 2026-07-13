import React from 'react';
import PropTypes from 'prop-types';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),transparent_35%),linear-gradient(180deg,#f8fafc,#e2e8f0)] px-6">
      <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-300/40 backdrop-blur">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <FiAlertTriangle size={28} />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          We couldn&apos;t load this problem
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          The request did not complete successfully. This usually means the AI request timed out,
          the backend is unavailable, or the provider returned an error.
        </p>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-800">
          {error || 'Unknown error'}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <FiRefreshCw className="mr-2" />
            Retry
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}

ErrorDisplay.propTypes = {
  error: PropTypes.string,
  onRetry: PropTypes.func,
};

ErrorDisplay.defaultProps = {
  error: '',
  onRetry: () => {},
};

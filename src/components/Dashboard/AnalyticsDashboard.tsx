"use client";

interface AnalyticsData {
  overview: {
    linkCount: number;
    totalClicks: number;
    clicksLast24h: number;
    clicksLast7days: number;
    avgClicksPerLink: number;
  };
  topLinks: Array<{
    id: string;
    slug: string;
    title: string;
    clicks: number;
  }>;
  locations: Array<{
    country: string;
    clicks: number;
  }>;
  devices: Array<{
    device: string;
    clicks: number;
  }>;
  browsers: Array<{
    browser: string;
    clicks: number;
  }>;
  operatingSystems: Array<{
    os: string;
    clicks: number;
  }>;
  recentActivity: Array<{
    id: string;
    slug: string;
    title: string | null;
    country: string | null;
    city: string | null;
    device: string | null;
    browser: string | null;
    os: string | null;
    timestamp: string;
  }>;
}

export default function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Analytics</h1>
        <p className="text-sm text-bodydark">
          Comprehensive analytics for your shortened links
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z" />
              <path d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.18139 8.35313 8.18139 6.80625C8.18139 6.6 8.21577 6.42813 8.25014 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73764 5.87813C6.66889 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z" />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {data.overview.totalClicks.toLocaleString()}
              </h4>
              <span className="text-sm font-medium">Total Clicks</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 1.25C5.89 1.25 1.75 5.39 1.75 10.5C1.75 15.61 5.89 19.75 11 19.75C16.11 19.75 20.25 15.61 20.25 10.5C20.25 5.39 16.11 1.25 11 1.25ZM11 18.25C6.72 18.25 3.25 14.78 3.25 10.5C3.25 6.22 6.72 2.75 11 2.75C15.28 2.75 18.75 6.22 18.75 10.5C18.75 14.78 15.28 18.25 11 18.25Z" />
              <path d="M11 5.5C10.59 5.5 10.25 5.84 10.25 6.25V11.25C10.25 11.66 10.59 12 11 12C11.41 12 11.75 11.66 11.75 11.25V6.25C11.75 5.84 11.41 5.5 11 5.5Z" />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {data.overview.clicksLast24h}
              </h4>
              <span className="text-sm font-medium">Last 24 Hours</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z" />
              <path d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z" />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {data.overview.linkCount}
              </h4>
              <span className="text-sm font-medium">Total Links</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469Z" />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {data.overview.avgClicksPerLink}
              </h4>
              <span className="text-sm font-medium">Avg Clicks/Link</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        {/* Top Links */}
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Top Performing Links
          </h4>

          <div className="flex flex-col">
            {data.topLinks.length === 0 ? (
              <p className="text-sm text-bodydark">No links yet</p>
            ) : (
              <div className="space-y-3">
                {data.topLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between border-b border-stroke pb-3 last:border-0 dark:border-strokedark"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <span className="text-sm font-medium text-black dark:text-white">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {link.title}
                        </p>
                        <p className="text-sm text-bodydark">/{link.slug}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black dark:text-white">
                        {link.clicks}
                      </p>
                      <p className="text-sm text-bodydark">clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Locations */}
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Top Locations
          </h4>

          <div className="flex flex-col">
            {data.locations.length === 0 ? (
              <p className="text-sm text-bodydark">No location data yet</p>
            ) : (
              <div className="space-y-3">
                {data.locations.map((location) => (
                  <div
                    key={location.country}
                    className="flex items-center justify-between border-b border-stroke pb-3 last:border-0 dark:border-strokedark"
                  >
                    <p className="font-medium text-black dark:text-white">
                      {location.country}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-40 rounded-full bg-stroke dark:bg-strokedark">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(location.clicks / data.locations[0].clicks) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{location.clicks}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Devices
          </h4>

          <div className="flex flex-col space-y-3">
            {data.devices.length === 0 ? (
              <p className="text-sm text-bodydark">No device data yet</p>
            ) : (
              data.devices.map((device) => (
                <div
                  key={device.device}
                  className="flex items-center justify-between border-b border-stroke pb-3 last:border-0 dark:border-strokedark"
                >
                  <p className="font-medium text-black dark:text-white capitalize">
                    {device.device}
                  </p>
                  <span className="text-sm font-medium">{device.clicks}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Browsers */}
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Browsers
          </h4>

          <div className="flex flex-col space-y-3">
            {data.browsers.length === 0 ? (
              <p className="text-sm text-bodydark">No browser data yet</p>
            ) : (
              data.browsers.map((browser) => (
                <div
                  key={browser.browser}
                  className="flex items-center justify-between border-b border-stroke pb-3 last:border-0 dark:border-strokedark"
                >
                  <p className="font-medium text-black dark:text-white">
                    {browser.browser}
                  </p>
                  <span className="text-sm font-medium">{browser.clicks}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Recent Activity
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Link
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Location
                </th>
                <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                  Device
                </th>
                <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                  Browser
                </th>
                <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                  OS
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {data.recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-5 text-center">
                    <p className="text-sm text-bodydark">No recent activity</p>
                  </td>
                </tr>
              ) : (
                data.recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {activity.title || activity.slug}
                      </p>
                      <p className="text-sm text-bodydark">/{activity.slug}</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {activity.city ? `${activity.city}, ` : ""}
                        {activity.country || "Unknown"}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 capitalize dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {activity.device || "Unknown"}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {activity.browser || "Unknown"}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {activity.os || "Unknown"}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-sm text-black dark:text-white">
                        {formatDate(activity.timestamp)}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

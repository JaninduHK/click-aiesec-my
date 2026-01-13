"use client";

interface ChartsData {
  clicksOverTime: Array<{
    date: string;
    clicks: number;
  }>;
  locationData: Array<{
    country: string;
    clicks: number;
  }>;
  deviceData: Array<{
    device: string;
    clicks: number;
  }>;
  topLinksData: Array<{
    slug: string;
    title: string;
    clicks: number;
  }>;
}

export default function ChartsView({ data }: { data: ChartsData }) {
  const maxClicks = Math.max(...data.clicksOverTime.map((d) => d.clicks), 1);
  const deviceTotal = data.deviceData.reduce((sum, d) => sum + d.clicks, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Charts</h1>
        <p className="text-sm text-bodydark">
          Visual analytics for your shortened links
        </p>
      </div>

      {/* Clicks Over Time */}
      <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 justify-between gap-4 sm:flex">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Clicks Over Time (Last 30 Days)
            </h4>
          </div>
        </div>

        <div>
          <div className="flex h-80 items-end justify-between gap-2">
            {data.clicksOverTime.length === 0 ? (
              <p className="text-bodydark">No data available</p>
            ) : (
              data.clicksOverTime.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex w-full flex-col items-center justify-end" style={{ height: "280px" }}>
                    <span className="mb-1 text-xs text-black dark:text-white">
                      {item.clicks}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-primary"
                      style={{
                        height: `${(item.clicks / maxClicks) * 100}%`,
                        minHeight: item.clicks > 0 ? "4px" : "0",
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-bodydark">
                    {new Date(item.date).getDate()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        {/* Device Distribution */}
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Device Distribution
          </h4>

          <div className="mb-6">
            {data.deviceData.length === 0 ? (
              <p className="text-sm text-bodydark">No device data available</p>
            ) : (
              <div className="space-y-4">
                {data.deviceData.map((device, index) => {
                  const percentage = deviceTotal > 0 ? (device.clicks / deviceTotal) * 100 : 0;
                  const colors = ["bg-primary", "bg-secondary", "bg-success", "bg-warning"];
                  const color = colors[index % colors.length];

                  return (
                    <div key={device.device}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium capitalize text-black dark:text-white">
                          {device.device}
                        </span>
                        <span className="text-sm">
                          {device.clicks} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          {data.deviceData.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {data.deviceData.map((device, index) => {
                const colors = ["bg-primary", "bg-secondary", "bg-success", "bg-warning"];
                const color = colors[index % colors.length];
                return (
                  <div key={device.device} className="flex items-center gap-2">
                    <span className={`block h-3 w-3 rounded-full ${color}`}></span>
                    <p className="text-sm capitalize">
                      <span className="text-black dark:text-white">{device.device}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Links */}
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Top Links Performance
          </h4>

          <div className="flex flex-col space-y-4">
            {data.topLinksData.length === 0 ? (
              <p className="text-sm text-bodydark">No links data available</p>
            ) : (
              data.topLinksData.map((link, index) => {
                const maxLinkClicks = Math.max(...data.topLinksData.map((l) => l.clicks), 1);
                const percentage = (link.clicks / maxLinkClicks) * 100;
                const colors = ["bg-primary", "bg-secondary", "bg-success", "bg-warning", "bg-danger"];
                const color = colors[index % colors.length];

                return (
                  <div key={link.slug}>
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {link.title}
                        </p>
                        <p className="text-xs text-bodydark">/{link.slug}</p>
                      </div>
                      <span className="text-sm font-medium">{link.clicks}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Location Chart */}
        <div className="col-span-1 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-2">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Geographic Distribution
          </h4>

          <div className="flex flex-wrap gap-4">
            {data.locationData.length === 0 ? (
              <p className="text-sm text-bodydark">No location data available</p>
            ) : (
              data.locationData.map((location) => {
                const maxLocationClicks = Math.max(...data.locationData.map((l) => l.clicks), 1);
                const size = Math.max(60, (location.clicks / maxLocationClicks) * 120);

                return (
                  <div
                    key={location.country}
                    className="flex flex-col items-center justify-center rounded-lg border border-stroke p-4 dark:border-strokedark"
                    style={{ minWidth: "120px" }}
                  >
                    <div
                      className="mb-2 flex items-center justify-center rounded-full bg-primary text-white"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                    >
                      <span className="text-lg font-bold">{location.clicks}</span>
                    </div>
                    <p className="text-sm font-medium text-black dark:text-white">
                      {location.country}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

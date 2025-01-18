module.exports = {
  rewrites: async () => {
    return [
      {
        source: '/:path*',
        destination: '/index.html',
      },
    ];
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=1, stale-while-revalidate',
          },
        ],
      },
    ];
  },
};

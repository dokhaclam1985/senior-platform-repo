exports.up = (pgm) => {
  pgm.addColumn('orders', {
    status: {
      type: 'varchar(30)',
      notNull: true,
      default: 'pending',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('orders', 'status');
};
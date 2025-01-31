'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job_offers', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fetch_batch_id: {
        type: Sequelize.BIGINT,
        references: { model: 'job_fetch_batches', key: 'id' },
        onDelete: 'SET NULL',
      },
      job_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      job_type: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      company: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      salary_min: {
        type: Sequelize.DOUBLE,
      },
      salary_max: {
        type: Sequelize.DOUBLE,
      },
      salary_currency: {
        type: Sequelize.STRING,
      },
      posted_at: {
        type: Sequelize.DATE,
      },
      skills: {
        type: Sequelize.JSON,
      },
      details: {
        type: Sequelize.JSON,
      },
      raw_job_data: {
        type: Sequelize.JSON,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('job_offers');
  },
};

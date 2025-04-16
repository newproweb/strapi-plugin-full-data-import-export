"use strict";

const fs = require("fs");
const { exec } = require("child_process");
const sizeUtils = require("../utils/size.utils");

module.exports = ({ strapi }) => {
  const dataFolderPath = __dirname + "/../data";
  const fileName = "data-seed";
  const lockFileName = "generate.lock";
  const meta = { name: "", size: "", updated_at: "" };

  return {
    async metadata() {
      // Generate in progress
      if (this._isLocked()) {
        const lockFileMeta = fs.statSync(`${dataFolderPath}/${lockFileName}`);
        return { name: "Generating", size: 0, updated_at: lockFileMeta.mtime };
      }

      const file = `${dataFolderPath}/${fileName}.tar.gz`;
      const fileExists = fs.existsSync(file);
      if (!fileExists) return meta;

      const fileMeta = fs.statSync(file);
      return {
        name: fileName + ".tar.gz",
        size: sizeUtils.bytesToSize(fileMeta.size),
        updated_at: fileMeta.mtime,
      };
    },

    async generate() {
      if (!this._isLocked()) {
        this._lock();

        const exportCommand = `npx strapi export --no-encrypt --file ${dataFolderPath}/${fileName}`;
        exec(exportCommand, (err, stdout, stderr) => {
          this._unlock();

          console.log(err);
          console.log(stdout);
          console.log(stderr);
        });
      }
    },

    async getFileReadStream() {
      const file = `${dataFolderPath}/${fileName}.tar.gz`;

      const fileExists = fs.existsSync(file);
      if (!fileExists) return undefined;

      return fs.createReadStream(file);
    },

    async delete() {
      const file = `${dataFolderPath}/${fileName}.tar.gz`;

      const fileExists = fs.existsSync(file);
      if (fileExists) fs.unlinkSync(file);

      return true;
    },

    async upload(file) {
      if (!this._isLocked()) {
        this._lock();

        const dataFile = `${dataFolderPath}/${fileName}.tar.gz`;
        if (fs.existsSync(dataFile)) fs.unlinkSync(dataFile);
        fs.copyFileSync(file.path, dataFile);
        fs.unlinkSync(file.path);

        const importCommand = `npx strapi import --force -f ${dataFile}`;
        exec(importCommand, { cwd: process.cwd() }, (err, stdout, stderr) => {
          this._unlock();

          console.log(err);
          console.log(stdout);
          console.log(stderr);
        });
      }
    },

    _isLocked() {
      const lockFile = `${dataFolderPath}/${lockFileName}`;
      return fs.existsSync(lockFile);
    },

    _lock() {
      const lockFile = `${dataFolderPath}/${lockFileName}`;

      if (!fs.existsSync(lockFile)) {
        fs.writeFileSync(`${dataFolderPath}/${lockFileName}`, "");
      }
    },

    _unlock() {
      const lockFile = `${dataFolderPath}/${lockFileName}`;
      fs.unlinkSync(lockFile);
    },
  };
};

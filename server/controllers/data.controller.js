"use strict";

module.exports = ({ strapi }) => ({
  dataFileService: strapi
    .plugin("full-data-import-export")
    .service("dataFileService"),

  async meta(ctx) {
    ctx.body = await this.dataFileService.metadata();
  },

  async generate(ctx) {
    await this.dataFileService.generate();
    ctx.body = "Generate Started";
  },

  async delete(ctx) {
    await this.dataFileService.delete();
    ctx.body = "Deleted";
  },

  async download(ctx) {
    const fileStream = await this.dataFileService.getFileReadStream();

    ctx.attachment("./../data/data-seed.tar.gz");
    ctx.set("Content-Type", "application/gzip");
    ctx.set("Access-Control-Expose-Headers", "Content-Disposition");

    ctx.body = fileStream;
  },

  async upload(ctx) {
    const { files } = ctx.request;

    await this.dataFileService.upload(files["data-file"]);

    ctx.body = "Generating";
  },
});

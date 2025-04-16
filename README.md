# Strapi Full Data Import Export Plugin ✨

## Overview 🌟

The **Strapi Full Data Import Export Plugin** provides an easy way to export and import your Strapi content directly from the Strapi Admin Panel. With this plugin, you can:

- **Export** your Strapi content to a downloadable data file 📥.
- **Import** content from a previously downloaded data file back into Strapi 📤.

This plugin simplifies the process of managing and transferring content across environments, and can be especially useful for migrating or backing up your content. 🌍

## Features 🔧

- **Export** content from Strapi to a data file (e.g., JSON, CSV) 💾.
- **Import** content back into Strapi from the data file 🔄.
- Fully integrated within the Strapi Admin Panel for a seamless user experience 🖥️.
- Supports data backup and migration between different environments 🛠️.

## How to use 🛠️

#### 1. Generate and download data-file

Go to admin->Full Data Import Export->Generate New
This will start the process of generation of the data-file in server. Be patient and wait until process ends. It may take some time depending on the size of the data.
Then you will be able download the generated file or delete it in server

#### 2. Upload and import the data

Go to admin->Full Data Import Export->

## Installation 🛠️

To install the Strapi Import/Export plugin, follow these steps:
In the root of your Strapi project, run the following command:

```bash
npm install strapi-plugin-full-data-import-export
```

Or, if you’re using Yarn:

```bash
yarn add strapi-plugin-full-data-import-export
```

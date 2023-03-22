/** Copy resources (images and models) from the library package to the scene folder */

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

// npm_config_local_prefix env var gives us the path to the current scene project
const scene_folder = path.resolve(process.env["npm_config_local_prefix"]);

// library dir path can be found thanks to __dirname
const lib_folder = path.resolve(__dirname, "..");

if (scene_folder === lib_folder) {
  return;
}

// list of resources to be copied from library to scene folder
const resources = [
  {
    src: path.join("images", "kiosk"),
    dest: path.join("images", "kiosk"),
  },
  {
    src: path.join("models", "kiosk"),
    dest: path.join("models", "kiosk"),
  },
];

resources.map((resource) => {
  fs.cpSync(
    path.resolve(lib_folder, resource.src),
    path.resolve(scene_folder, resource.dest),
    {
      force: true,
      preserveTimestamps: true,
      recursive: true,
    }
  );
  fs.writeFileSync(
    path.resolve(scene_folder, resource.dest, ".boson-dcl.resources"),
    `Resources copied from ${process.env["npm_package_name"]}:${process.env["npm_package_version"]} package.` +
      `\n\n*** Please do not remove content ***` +
      `\n`
  );
});

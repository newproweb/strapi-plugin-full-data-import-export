import { MenuIcon } from "./Components/MenuIcon";
import pluginId from "./pluginId";

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/full-data-import-export`,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: "Full Data Import Export",
      },
      icon: MenuIcon,
      Component: async () => await import("./Screens/import-export"),
    });
  },
  bootstrap(app) {},
};

export const layoutTokens = {
  components: {
    toolbar: {
      colorScheme: {
        light: {
          root: {
            background: '{surface.100}',
            borderColor: '{surface.200}',
            color: '{primary.800}',
          },
        },
        dark: {
          root: {
            background: '{surface.800}',
            borderColor: '{surface.700}',
            color: '{surface.100}',
          },
        },
      },
    },
    menu: {
      colorScheme: {
        light: {
          root: {
            background: '{surface.100}',
          },
        },
        dark: {
          root: {
            background: '{surface.800}',
          },
        },
      },
    },
    panelmenu: {
      colorScheme: {
        light: {
          panel: {
            background: '{surface.100}',
            borderColor: '{surface.200}',
          },
          item: {
            focusBackground: '{surface.200}',
            activeBackground: '{primary.50}',
            color: '{surface.700}',
            focusColor: '{surface.900}',
            activeColor: '{primary.700}',
          },
          submenuLabel: {
            background: '{surface.200}',
            color: '{surface.500}',
          },
        },
        dark: {
          panel: {
            background: '{surface.800}',
            borderColor: '{surface.700}',
          },
          item: {
            focusBackground: '{surface.700}',
            activeBackground: '{primary.900}',
            color: '{surface.100}',
            focusColor: '{surface.0}',
            activeColor: '{primary.200}',
          },
          submenuLabel: {
            background: '{surface.900}',
            color: '{surface.400}',
          },
        },
      },
    },
  },
};

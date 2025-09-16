const commonColor = {
    colors: {
        commonWhite: '#FFFFFF',
        commonBlack: '#000000',
    },
};
const light = {
    colors: {
        themeColor: { backgroundColor: '#F0F0F0' },
        backgroundGray: { backgroundColor: '#ffffff' },
        tabBarStyle: {
            backgroundColor: '#fff',
        },
        textColorList: {
            color: '#242424',
        },
        textColorBlue: {
            color: '#4F76FF',
        },
        ...commonColor.colors,
    },
};
const dark = {
    colors: {
        themeColor: { backgroundColor: '#1F1F1F' },
        backgroundGray: { backgroundColor: '#3D3D3D' },
        tabBarStyle: {
            backgroundColor: 'rgba(20, 20, 20, 0.94)',
        },
        textColorList: {
            color: '#fff',
        },
        textColorBlue: {
            color: '#fff',
        },
        ...commonColor.colors,
    },
};

export default { light, dark };

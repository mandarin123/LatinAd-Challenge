import { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#3996f3',
    borderRadius: 0,
    fontFamily: "'Poppins', sans-serif",
    colorText: '#333333',
    colorTextHeading: '#000000',
    colorLink: '#3996f3',
    colorBgContainer: '#FFFFFF',
  },
  components: {
    Button: {
      borderRadius: 0,
      controlHeight: 40,
      colorPrimary: '#3996f3',
      colorPrimaryHover: '#163b78',
      colorPrimaryActive: '#163b78',
      colorTextLightSolid: '#FFFFFF',
    },
    Layout: {
      footerBg: '#F5F5F5',
    },
    Typography: {
      fontFamilyCode: "'Poppins', sans-serif",
    }
  }
};

export default theme; 
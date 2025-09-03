import { App } from 'antd';
import Content from './layout-components/content';
import HeaderWrapper from './layout-components/header-wrapper';

function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <App>
      <HeaderWrapper />
      <Content>{children}</Content>
    </App>
  );
}

export default LayoutProvider;

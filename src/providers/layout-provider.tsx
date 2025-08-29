import Content from './layout-components/content';
import HeaderWrapper from './layout-components/header-wrapper';

function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <HeaderWrapper />
      <Content>{children}</Content>
    </div>
  );
}

export default LayoutProvider;

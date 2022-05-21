import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import Dropdown from '../dropdown/dropdown';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import useConfigInject from '../_util/hooks/useConfigInject';
import type { MouseEventHandler } from '../_util/EventInterface';

export const breadcrumbItemProps = () => ({
  prefixCls: String,
  href: String,
  separator: PropTypes.any,
  overlay: PropTypes.any,
  onClick: Function as PropType<MouseEventHandler>,
});

export type BreadcrumbItemProps = Partial<ExtractPropTypes<ReturnType<typeof breadcrumbItemProps>>>;
export default defineComponent({
  name: 'ABreadcrumbItem',
  inheritAttrs: false,
  __ANT_BREADCRUMB_ITEM: true,
  props: breadcrumbItemProps(),
  // emits: ['click'],
  slots: ['separator', 'overlay'],
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('breadcrumb', props);
    /**
     * if overlay is have
     * Wrap a Dropdown
     */
    const renderBreadcrumbNode = (breadcrumbItem: JSX.Element, prefixCls: string) => {
      const overlay = getPropsSlot(slots, props, 'overlay');
      if (overlay) {
        return (
          <Dropdown overlay={overlay} placement="bottom">
            <span class={`${prefixCls}-overlay-link`}>
              {breadcrumbItem}
              <DownOutlined />
            </span>
          </Dropdown>
        );
      }
      return breadcrumbItem;
    };

    return () => {
      const separator = getPropsSlot(slots, props, 'separator') ?? '/';
      const children = getPropsSlot(slots, props);
      const { class: cls, style, ...restAttrs } = attrs;
      let link: JSX.Element;
      if (props.href !== undefined) {
        link = (
          <a class={`${prefixCls.value}-link`} onClick={props.onClick} {...restAttrs}>
            {children}
          </a>
        );
      } else {
        link = (
          <span class={`${prefixCls.value}-link`} onClick={props.onClick} {...restAttrs}>
            {children}
          </span>
        );
      }
      // wrap to dropDown
      link = renderBreadcrumbNode(link, prefixCls.value);
      if (children) {
        return (
          <li class={cls} style={style as CSSProperties}>
            {link}
            {separator && <span class={`${prefixCls.value}-separator`}>{separator}</span>}
          </li>
        );
      }
      return null;
    };
  },
});

import { computed, defineComponent } from 'vue';
import { flattenChildren } from '../_util/props-util';
import useConfigInject from '../_util/hooks/useConfigInject';

import type { ExtractPropTypes, PropType, ComputedRef } from 'vue';
import type { SizeType } from '../config-provider';
import devWarning from '../vc-util/devWarning';
import createContext from '../_util/createContext';

export const buttonGroupProps = () => ({
  prefixCls: String,
  size: {
    type: String as PropType<SizeType>,
  },
});

export type ButtonGroupProps = Partial<ExtractPropTypes<ReturnType<typeof buttonGroupProps>>>;
export const GroupSizeContext = createContext<{
  size: ComputedRef<SizeType>;
}>();
export default defineComponent({
  name: 'AButtonGroup',
  props: buttonGroupProps(),
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('btn-group', props);
    GroupSizeContext.useProvide({
      size: computed(() => props.size),
    });
    const classes = computed(() => {
      const { size } = props;
      // large => lg
      // small => sm
      let sizeCls = '';
      switch (size) {
        case 'large':
          sizeCls = 'lg';
          break;
        case 'small':
          sizeCls = 'sm';
          break;
        case 'middle':
        case undefined:
          break;
        default:
          // eslint-disable-next-line no-console
          devWarning(!size, 'Button.Group', 'Invalid prop `size`.');
      }
      return {
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-${sizeCls}`]: sizeCls,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      };
    });
    return () => {
      return <div class={classes.value}>{flattenChildren(slots.default?.())}</div>;
    };
  },
});

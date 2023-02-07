import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { SizeType } from '../config-provider';
import { FormItemInputContext } from '../form/FormItemContext';
import type { FocusEventHandler, MouseEventHandler } from '../_util/EventInterface';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';

// CSSINJS
import useStyle from './style';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInputGroup',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    size: { type: String as PropType<SizeType> },
    compact: { type: Boolean, default: undefined },
    onMouseenter: { type: Function as PropType<MouseEventHandler> },
    onMouseleave: { type: Function as PropType<MouseEventHandler> },
    onFocus: { type: Function as PropType<FocusEventHandler> },
    onBlur: { type: Function as PropType<FocusEventHandler> },
  },
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('input-group', props);
    const formItemInputContext = FormItemInputContext.useInject();
    FormItemInputContext.useProvide(formItemInputContext, {
      isFormItemInput: false,
    });

    // style
    const { prefixCls: inputPrefixCls } = useConfigInject('input', props);
    const [wrapSSR, hashId] = useStyle(inputPrefixCls);

    const cls = computed(() => {
      const pre = prefixCls.value;
      return {
        [`${pre}`]: true,
        [hashId.value]: true,
        [`${pre}-lg`]: props.size === 'large',
        [`${pre}-sm`]: props.size === 'small',
        [`${pre}-compact`]: props.compact,
        [`${pre}-rtl`]: direction.value === 'rtl',
      };
    });
    return () => {
      return wrapSSR(
        <span
          {...attrs}
          class={classNames(cls.value, attrs.class)}
          onMouseenter={props.onMouseenter}
          onMouseleave={props.onMouseleave}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        >
          {slots.default?.()}
        </span>,
      );
    };
  },
});

import { defineComponent, CSSProperties, ref, onMounted } from 'vue';
/**
 * Wrap of sub component which need use as Button capacity (like Icon component).
 * This helps accessibility reader to tread as a interactive button to operation.
 */
import KeyCode from './KeyCode';
import PropTypes from './vue-types';

const inlineStyle = {
  border: 0,
  background: 'transparent',
  padding: 0,
  lineHeight: 'inherit',
  display: 'inline-block',
};

const TransButton = defineComponent({
  name: 'TransButton',
  inheritAttrs: false,
  props: {
    noStyle: PropTypes.looseBool,
    onClick: PropTypes.func,
    disabled: PropTypes.looseBool,
    autofocus: PropTypes.looseBool,
  },
  setup(props, { slots, emit, attrs, expose }) {
    const domRef = ref();
    const onKeyDown = (event: KeyboardEvent) => {
      const { keyCode } = event;
      if (keyCode === KeyCode.ENTER) {
        event.preventDefault();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const { keyCode } = event;
      if (keyCode === KeyCode.ENTER) {
        emit('click', event);
      }
    };
    const onClick = (e: Event) => {
      emit('click', e);
    };
    const focus = () => {
      if (domRef.value) {
        domRef.value.focus();
      }
    };

    const blur = () => {
      if (domRef.value) {
        domRef.value.blur();
      }
    };
    onMounted(() => {
      if (props.autofocus) {
        focus();
      }
    });

    expose({
      focus,
      blur,
    });
    return () => {
      const { noStyle, disabled, ...restProps } = props;

      let mergedStyle: CSSProperties = {};

      if (!noStyle) {
        mergedStyle = {
          ...inlineStyle,
        };
      }

      if (disabled) {
        mergedStyle.pointerEvents = 'none';
      }
      return (
        <div
          role="button"
          tabindex={0}
          ref={domRef}
          {...restProps}
          {...attrs}
          onClick={onClick}
          onKeydown={onKeyDown}
          onKeyup={onKeyUp}
          style={{
            ...mergedStyle,
            ...((attrs.style as object) || {}),
          }}
        >
          {slots.default?.()}
        </div>
      );
    };
  },
});

export default TransButton;

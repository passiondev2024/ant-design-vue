import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ACardGrid',
  __ANT_CARD_GRID: true,
  props: {
    prefixCls: PropTypes.string.def('ant-card'),
  },
  inject: {
    configProvider: { default: () => ({}) },
  },
  render() {
    const { prefixCls: customizePrefixCls } = this.$props;

    const getPrefixCls = this.configProvider.getPrefixCls || ConfigConsumerProps.getPrefixCls;
    const prefixCls = getPrefixCls('card', customizePrefixCls);

    const classString = {
      [`${prefixCls}-grid`]: true,
    };
    return (
      <div {...{ on: this.$listeners }} class={classString}>
        {this.$slots.default}
      </div>
    );
  },
};

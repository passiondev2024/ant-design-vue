import { reactive, provide } from 'vue';
import PropTypes from '../_util/vue-types';
import { getComponent } from '../_util/props-util';
import defaultRenderEmpty from './renderEmpty';
import LocaleProvider, { ANT_MARK } from '../locale-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';

function getWatch(keys = []) {
  const watch = {};
  keys.forEach(k => {
    watch[k] = function(value) {
      this.configProvider[k] = value;
    };
  });
  return watch;
}

const ConfigProvider = {
  name: 'AConfigProvider',
  props: {
    getPopupContainer: PropTypes.func,
    prefixCls: PropTypes.string,
    renderEmpty: PropTypes.func,
    csp: PropTypes.object,
    autoInsertSpaceInButton: PropTypes.bool,
    locale: PropTypes.object,
    pageHeader: PropTypes.object,
    transformCellText: PropTypes.func,
  },
  setup(props) {
    const configProvider = reactive({
      ...props,
      getPrefixCls: undefined,
      renderEmpty: undefined,
    });
    provide('configProvider', configProvider);
    return { configProvider };
  },
  created() {
    this.configProvider.getPrefixCls = this.getPrefixCls;
    this.configProvider.renderEmpty = this.renderEmpty;
  },
  watch: {
    ...getWatch([
      'prefixCls',
      'csp',
      'autoInsertSpaceInButton',
      'locale',
      'pageHeader',
      'transformCellText',
    ]),
  },
  methods: {
    renderEmptyComponent(name) {
      const renderEmpty = getComponent(this, 'renderEmpty', {}, false) || defaultRenderEmpty;
      return renderEmpty(name);
    },
    getPrefixCls(suffixCls, customizePrefixCls) {
      const { prefixCls = 'ant' } = this.$props;
      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
    },
    renderProvider(legacyLocale) {
      return (
        <LocaleProvider locale={this.locale || legacyLocale} _ANT_MARK__={ANT_MARK}>
          {this.$slots.default ? this.$slots.default() : null}
        </LocaleProvider>
      );
    },
  },

  render() {
    return <LocaleReceiver children={(_, __, legacyLocale) => this.renderProvider(legacyLocale)} />;
  },
};

export const ConfigConsumerProps = {
  getPrefixCls: (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls;
    return `ant-${suffixCls}`;
  },
  renderEmpty: defaultRenderEmpty,
};

/* istanbul ignore next */
ConfigProvider.install = function(app) {
  app.component(ConfigProvider.name, ConfigProvider);
};

export default ConfigProvider;

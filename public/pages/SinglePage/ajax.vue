<template>
  <div class="singlePage ajax MFlex">
    <h2>This page is a demo for ajax request OpenAd ads! </h2>
    <div class="openAds" v-if="img.src && img.href">
      <a href="javascript:void(0)" class="Flex" rel="noopener nofollow" @click="clickCb">
        <img :src="img.src"
             :width="img.width"
             :height="img.height"
             style="max-width: 100%;max-height: 100%;object-fit: contain;">
      </a>
    </div>
    <van-button @click="AjaxRequest" type="primary" v-if="!img.src && !img.href">
      Ajax Request
    </van-button>
    <van-button @click="router.push('/')" type="primary">
      Go Home
    </van-button>
  </div>
</template>
<script>
import { Button } from 'vant';
import { defineComponent, reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import Obj2String from '@/utils/Obj2String';

export default defineComponent({
  name: 'SinglePageAjax',
  components: {
    'van-button': Button,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const openAds = reactive({
      zoneId: proxy.$AppEnv.zoneId,
      reviveId: proxy.$AppEnv.reviveId,
    });
    const router = useRouter();
    const img = reactive({
      width: '',
      height: '',
      src: '',
      href: '',
      cb: '',
      tgData: {},
    });

    const extractLinks = (html) => {
      let hrefs = [];
      let hrefRegex = /href=['"]([^'"]*)['"]/g;
      let hrefMatch;
      while ((hrefMatch = hrefRegex.exec(html)) !== null) {
        hrefs.push(decodeURIComponent(hrefMatch[1]).replaceAll('&amp;', '&'));
      }

      let srcs = [];
      let srcRegex = /<img[^>]+src=['"]([^'"]*)['"]/g;
      let srcMatch;
      while ((srcMatch = srcRegex.exec(html)) !== null) {
        srcs.push(decodeURIComponent(srcMatch[1]).replaceAll('&amp;', '&'));
      }

      return {
        hrefs: hrefs,
        srcs: srcs,
      };

    }

    const AjaxRequest = () => {
      const app = window.Telegram.WebApp;
      const user = app.initDataUnsafe.user || {};
      img.tgData = {
        Cid: user.id || '',
        FirstName: user['first_name'] || '',
        LastName: user['last_name'] || '',
        lan: user['language_code'] || '',
        V: app.version || '',
        platform: app.platform || '',
        fromType: 'ajax',
      };
      const params = {
        zones: openAds.zoneId,
        prefix: 'revive-0-'+openAds.reviveId,
        referer: window.location.origin+window.location.pathname,
        loc: window.location.origin,
      }
      let url = 'https://alpha.openad.network/www/delivery/asyncspc.php'+Obj2String({ ...img.tgData, ...params });
      window.J$.ajax({
        method: 'get',
        url: 'https://api.allorigins.win/raw?url='+encodeURIComponent(url),
        async: false,
        dataType: 'json',
        jsonp: 'callback',
        success: (res) => {
          let d = res['revive-0-'+openAds.reviveId+'0'];
          img.width = d.width;
          img.height = d.height;
          d = extractLinks(d.html);
          img.src = d.srcs[0];
          img.href = d.hrefs[0];
          img.cb = d.srcs[1];
          // eslint-disable-next-line no-use-before-define
          ExecuteCallback(params);
        },
        error: (err) => {
          console.log('error', err);
        },
      });
    }

    const ExecuteCallback = (params) => {
      let urlParams = {};
      let parser = new URL(img.cb);
      let queryString = new URLSearchParams(parser.search);
      queryString.forEach((value, key) => {
        urlParams[key] = value;
      });
      const { bannerid, campaignid, zoneid, cb } = urlParams;
      let url = img.cb.substring(0, img.cb.indexOf('?'))+Obj2String({ ...img.tgData, bannerid, campaignid, zoneid, cb, loc: params.loc });
      window.J$.ajax({
        method: 'get',
        url: 'https://api.allorigins.win/raw?url='+encodeURIComponent(url),
        async: false,
        dataType: 'json',
        jsonp: 'callback',
        success: () => {},
        error: () => {},
      });
    }

    const clickCb = () => {
      let t = img.href.indexOf('&dest='), cbUrl = img.href.substring(0, t), href = img.href.substring(t+6);
      window.J$.ajax({
        method: 'get',
        url: 'https://api.allorigins.win/raw?url='+encodeURIComponent(cbUrl+Obj2String(img.tgData).replace('?', '&')+'&dest='+href),
        async: false,
        dataType: 'json',
        jsonp: 'callback',
        success: () => {
          window.open(href);
        },
        error: () => {
          window.open(href);
        },
      });
    }

    return { router, openAds, AjaxRequest, img, clickCb };
  },
});
</script>

<style scoped lang="less">
@import '@/shared/share.less';
</style>

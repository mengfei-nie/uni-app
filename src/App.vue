<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const systemModule = namespace('system')
const userModule = namespace('user')

@Component
export default class App extends Vue {
  mpType = 'app';

  @systemModule.Mutation setSystemInfo;
  @userModule.Action login;

  async onLaunch() {
    this.setSystemInfo()
  }

  onHide() {
    console.log('App Hide')
  }
}

</script>

<style>
/* 每个页面公共css */
page {
	width: 100%;
	height: 100%;
}
</style>

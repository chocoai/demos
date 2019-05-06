import { getPrefixUrl } from "../../service/common";

export default {
  data() {
    return {
      prefixUrl: ""
    };
  },
  created() {
    this.getPrefixUrl();
  },
  methods: {
    async getPrefixUrl() {
      const res = await getPrefixUrl();
      this.prefixUrl = res.data;
    }
  }
};

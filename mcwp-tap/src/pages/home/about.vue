<template>
  <div class="about">
    <h1>This is an about page{{api}}</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import { Config } from "@/utils/index.js";

export default {
  name: "home",
  data() {
    return {
      api: Config.api.url
    };
  }
};
</script>

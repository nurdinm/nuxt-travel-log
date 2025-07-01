<script setup lang="ts">
import { AppThemeToggle } from "#components";
</script>

<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost text-xl">
        Travel Log
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <AppThemeToggle />
      <a class="btn btn-accent">Sign in With Github <Icon name="tabler:brand-github" size="24" /></a>
    </div>
  </div>
</template>

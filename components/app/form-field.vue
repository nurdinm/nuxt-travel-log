<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  tag?: "text" | "textarea";
  type?: "text" | "number";
  errors?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :as="tag || 'input'"
      :name="props.name"
      :type="type || 'text'"
      :disabled="disabled"
      class="w-full"
      :class="{
        'input-error': props.errors,
        'textarea': tag === 'textarea',
        'input': !tag || tag === 'text',
      }"
    />
    <p v-if="props.errors" class="label text-error">
      {{ props.errors }}
    </p>
  </fieldset>
</template>

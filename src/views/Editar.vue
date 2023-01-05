<template>
    <a-form
        :model="formState"
        @finish="onFinish"
        name="editForm"
        layout="vertical"
        autocomplete="off"
    >
        <a-form-item
            name="url"
            :rules="[{
                required: true,
                type:'url',
                whitespace: true,
                message: 'Ingrese una url válida'
            }]"
        >
            <a-input
                v-model:value="formState.url"
                placeholder="Ingrese una url"
            />
        </a-form-item>
        <a-form-item>
            <a-button
                type="primary"
                html-type="submit"
                :loading="databaseStore.loadingDoc"
            >Editar</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { onMounted, reactive } from 'vue';
import { useRoute } from "vue-router";
import { useDatabseStore } from "../stores/database";

const route = useRoute()
const databaseStore = useDatabseStore()
const formState = reactive({ url: ''})

onMounted(async() => {
    formState.url = await databaseStore.leerUrl(route.params.id)
});

const onFinish = async () => {
    const res = await databaseStore.editUrl(route.params.id, formState.url)
    if (!res) {
        message.success('Url Editada ')
    }
}

// console.log(route.params.id);
</script>
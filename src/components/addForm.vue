<template>
    <a-form
        :model="formState"
        @finish="onFinish"
        name="basicAdd"
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
            >Agregar</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { reactive } from "vue";
import { useDatabseStore } from '../stores/database';
import { message } from 'ant-design-vue';

const databaseStore = useDatabseStore()
const formState = reactive({ url: ''})

const onFinish = async () => {
    const res = await databaseStore.addUrl(formState.url)
    formState.url = ''

    if (!res) {
        message.success('URL agregada con éxito')
    }
    /* switch (res) {
        case '':
            message.error('')
            break;
        default:
            message.error('Ocurrió un fallo en el servidor. Intente de nuevo o comuniquese con el administrador')
            break;
    } */
}


</script>
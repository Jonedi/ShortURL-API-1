<template>
    <a-row justify="center">
        <a-col
            :xs="{ span: 24 }"
            :sm="{ span: 18, offset: 3 }"
            :md="{ span: 18, offset: 3 }"
            :lg="{ span: 12 }"
            :xl="{ span: 12 }"
            :xxl="{ span: 12 }"
            class="mx-auto"
        >
        <div class="mb-3 text-center">
            <a-avatar :src="userData.photoURL" :size="{xs: 80, sm:80, md:100, lg:100, xl: 150, xxl:150}"></a-avatar>
        </div>
        <h1 class="mb-3 text-center" v-if="userData.displayName">Perfil de {{ userData.displayName }}</h1>
        <h1 class="mb-3 text-center" v-else>Perfil de {{ userData.email }}</h1>
            <a-form
                :model="userData"
                @finish="onFinish"
                name="updateProfile"
                autocomplete="on"
                layout="vertical"
            >
                <a-form-item
                    name="email"
                    :rules="[{ required: true, type:'email', message: 'Por favor ingresa un email!' }]"
                >
                    <a-input
                        v-model:value="userData.email"
                        placeholder="Correo electrónico"
                        disabled
                    />
                </a-form-item>
                <a-form-item
                    name="displayName"
                    :rules="[{ required:true, message: 'Por favor ingrese un nick válido!' }]"
                >
                    <a-input
                        v-model:value="userData.displayName"
                        placeholder="Digite su Nickname"
                    />
                </a-form-item>
                <a-upload
                    v-model:file-list="fileList"
                    list-type="picture"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                >
                    <a-button class="mb-1">Subir Imagen</a-button>
                </a-upload>
                <a-form-item>
                    <a-button 
                        type="primary"
                        html-type="submit"
                        :disabled="useUserStore().loadingUser"
                        :loading="useUserStore().loadingUser"
                    >Actualizar</a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>
<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import { message } from "ant-design-vue";

const { userData } = useUserStore();
const userStore = useUserStore();
const fileList = ref([])

const beforeUpload = (file) => {
    return false
}
const handleRemove = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
};
const handleChange = (info) => {
    // validar los tipos de imágenes
    if (info.file.status !== "uploading") {
        const isJpgOrPng =
            info.file.type === "image/jpeg" || info.file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("Solo imagenes png o jpg");
            handleRemove(info.file);
            return;
        }
        const isLt2M = info.file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Máximo 2MB!");
            handleRemove(info.file);
            return;
        }
    }
    /* valida que sea solo una imagen
    si el user sube otra, se reemplazará */
    let resFileList = [...info.fileList];
    resFileList = resFileList.slice(-1);
    resFileList = resFileList.map((file) => {
        if (file.response) {
            file.url = file.response.url;
        }
        return file;
    });
    fileList.value = resFileList;
}
const onFinish = async () => {
    const error = await userStore.updateUser(
        userData.displayName,
        fileList.value[0]
    );
    if (!error) {
        return message.success("Se actualizó tu información de perfil");
    }
    message.error("Ocurrió un error al actualizar el perfil");
};
</script>
<style lang="sass">
    
</style>
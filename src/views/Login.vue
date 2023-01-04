<template>
    <a-row>
        <a-col
            :xs="{ span: 24 }"
            :sm="{ span: 18, offset: 3 }"
            :lg="{ span: 12, offset: 6 }"
        >
            <h1 class="mb-3 text-center">Login</h1>
            <a-form
                :model="formState"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
                name="login"
                autocomplete="on"
                layout="vertical"
            >
                <a-form-item
                    name="email"
                    :rules="[{ required: true, type:'email', message: 'Por favor ingresa un email!' }]"
                >
                    <a-input
                        v-model:value="formState.email"
                        placeholder="Digite su correo electrónico"
                    />
                </a-form-item>
                <a-form-item
                    name="password"
                    :rules="[{ required: true, min: 6, message: 'Por favor ingresa una contraseña de mínimo 6 caracteres!' }]"
                >
                    <a-input-password
                        v-model:value="formState.password"
                        placeholder="Digite su contraseña"
                        
                    />
                </a-form-item>
                <a-form-item>
                    <a-button
                    type="primary"
                    html-type="submit"
                    :disabled="useUserStore().loadingUser"
                    :loading="useUserStore().loadingUser"
                    >Iniciar Sesión</a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { reactive } from "vue";
import { message } from 'ant-design-vue';

const { loginUser } = useUserStore()

const formState = reactive({
    password: "",
    email: "",
});

const onFinish = async (values) => {
    const res = await loginUser(formState.email, formState.password)
    // console.log(res)

    if (!res) {
        return message.success('Bienvenido a App Base')
    }

    switch (res) {
        case 'auth/wrong-password':
            message.error('Credenciales no válidas')
            break;
        case 'auth/user-not-found':
            message.error('el usuario no existe')
            break;
        case 'auth/user-disabled' :
            message.error('El usuario está inactivo, por favor comuniquese con el administrador')
            break;
        default:
            message.error('Ocurrió un fallo en el servidor. Intente de nuevo o comuniquese con el administrador')
            break;
    }
};

const onFinishFailed = async (errorInfo) => {
    console.log('Failed', errorInfo);
};
</script>

<style lang="scss">
#app .d-flex { display: flex; }
.justify-center { justify-content: center; }
</style>
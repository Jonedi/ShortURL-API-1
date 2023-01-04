<template>
    <div>
        <a-row justify="center">
            <a-col
                :xs="{ span: 24 }"
                :sm="{ span: 18, offset: 3 }"
                :lg="{ span: 12, offset: 6 }"
            >
            <h1 class="mb-3 text-center">Sign Up</h1>
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
                    <a-form-item
                        name="rePassword"
                        :rules="[{ validator: validatePass }]"
                    >
                        <a-input-password
                            v-model:value="formState.rePassword"
                            placeholder="Repita la contraseña"
                            
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
    </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { reactive } from "vue";
import { message } from "ant-design-vue";


const { registerUser } = useUserStore()

const formState = reactive({
    password: "",
    rePassword: '',
    email: "",
});

const onFinish = async (values) => {
    const res = await registerUser(formState.email, formState.password)
    
    if (!res) {
        return message.success('El usuario ha sido registrado satisfactoriamente, revisa tu correo electrónico e inicia sesión')
    }

    switch (res) {
        case 'auth/email-already-in-use':
            message.error('Email ya registrado, intente con otro email')
            break;
    
        default:
            message.error('Ocurrió un fallo en el servidor. Intente de nuevo o comuniquese con el administrador')
            break;
    }
};

const onFinishFailed = async (errorInfo) => {
    console.log('Failed', errorInfo);
};

const validatePass = async(_rule, value) => {
    if (value === '') {
        return Promise.reject('Repita contraseña')
    }
    if (value !== formState.password) {
        return Promise.reject('No coincide la contraseña')
    }
    return Promise.resolve()
};

</script>

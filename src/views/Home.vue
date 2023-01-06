<template>
    <div>
        <h1 class="mb-3" v-if="userData.displayName">Hola {{ userData.displayName }}</h1>
        <h1 class="mb-3" v-else>Hola {{ userData.email }}</h1>

        <add-form></add-form>
        
        <a-space style="width: 100%;" v-if="!dbStore.loadingDoc" direction="vertical">
            <a-card
                :title="item.short"
                v-for="item in dbStore.docs" :key="item.id"
            >
                <template #extra class="justify-center">
                    <a-space>
                        <a-button type="primary" shape="round" ghost @click="router.push(`editar/${item.id}`)">Editar</a-button>
                        <a-popconfirm
                            title="¿Estás seguro(a) de eliminar este elemento?"
                            ok-text="Sí"
                            cancel-text="No"
                            @confirm="confirm(item.id)"
                            @cancel="cancel"
                        >
                            <a-button type="primary" shape="round" :loading="dbStore.loadingDoc">Eliminar</a-button>
                        </a-popconfirm>
                        <a-button shape="round" @click="copiarUrl(item.id)">Copiar</a-button>
                    </a-space>
                </template>
                <p class="text-wrap">{{ item.name }}</p>
            </a-card>
        </a-space>
        
        <div v-else>
            <div class="e_center">
                <a-spin tip="Loading" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useDatabseStore } from "../stores/database";
import { useRouter } from "vue-router";
import { message } from 'ant-design-vue';


const router = useRouter()
const { userData } = useUserStore()
const dbStore = useDatabseStore()
dbStore.getUrls()

const confirm = async (id) => {
    const res = await dbStore.deleteUrl(id)
    console.log(res);
    if (!res) {
        message.success('El elemento ha sido eliminado')
    }
    // message.error(res)
}

const copiarUrl = async (id) => {
    if (!navigator.clipboard) {
        return message.error("No se pudo copiar al portapapeles 💋");
    }

    const path = `${window.location.origin}/${id}`;
    const err = await navigator.clipboard.writeText(path);

    if (err) {
        message.error("No se pudo copiar al portapapeles 💋");
    } else {
        message.success("Se copió con éxito 💋");
    }
}

const cancel = () => {
    message.warning('La acción ha sido abortada')
};
</script>
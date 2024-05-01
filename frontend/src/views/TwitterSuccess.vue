<script setup>
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Index from '../components/Index.vue'
const router = useRouter();
const route = useRoute();
const code = ref(null);


watch(code, async () => {
    if (code) {
        const response = await axios.post('https://api.twitter.com/oauth/access_token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: 'V1FrUFdVZ3picVFSUGtHWExpR1I6MTpjaQ',
                client_secret: 'goM30d8fWPtizfTnohJhwIkDy1daOYJfiuc7M-tnpcO_PjOdLh',
                code,
                redirect_uri: 'http://localhost:5173/twitter-success', // Must match the original redirect URI
            },
        });
        console.log(response);
        const accessToken = response.data.access_token;
        // Now you have the access token!

        // Use the access token to make authenticated requests to Twitter API
        // For example, get user data:
        const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(userResponse);
        const userId = userResponse.data.id;
        const userName = userResponse.data.username;
        // Now you have the user data!
        console.log(userName);
        // Handle the user data as needed (e.g., store in database, etc.)

        // Redirect the user to a success page
        res.redirect('/success');
    }
}, { deep: true })


onMounted(async () => {
    if (code) {
        const response = await axios.post('https://api.twitter.com/oauth/access_token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: 'V1FrUFdVZ3picVFSUGtHWExpR1I6MTpjaQ',
                client_secret: 'goM30d8fWPtizfTnohJhwIkDy1daOYJfiuc7M-tnpcO_PjOdLh',
                code,
                redirect_uri: 'http://localhost:5173/twitter-success', // Must match the original redirect URI
            },
        });
        console.log(response);
        const accessToken = response.data.access_token;
        // Now you have the access token!

        // Use the access token to make authenticated requests to Twitter API
        // For example, get user data:
        const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(userResponse);
        const userId = userResponse.data.id;
        const userName = userResponse.data.username;
        // Now you have the user data!
        console.log(userName);
        // Handle the user data as needed (e.g., store in database, etc.)

        // Redirect the user to a success page
        res.redirect('/success');
    }
    code.value = route?.query?.code;
    console.log(code.value);
})
</script>

<template>
    <main class="gradient-bg min-h-screen p-4">
        <Index />
    </main>
</template>

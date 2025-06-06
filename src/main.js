import { createApp } from 'vue'
import App from './App.vue'
import axios from '@/axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css';
import RecognizeCharacter from './components/RecognizeCharacter.vue';
import SimilarCharacter from './components/SimilarCharacter.vue';
import StrokeOrder from './components/StrokeOrder.vue';
import CharacterAudio from './components/CharacterAudio.vue';
import LearningCards from './components/LearningCards.vue';
import CardDetails from './components/CardDetails.vue';
import UserRegister from './components/UserRegister.vue';
import UserLogin from './components/UserLogin.vue';
import NavigationBar from './components/NavigationBar.vue';
import ScanCharacters from './components/ScanCharacters.vue';
import HSKLevelCharacters from './components/HSKLevelCharacters.vue';
import CategoryModal from './components/CategoryModal.vue';
import drawCharacter from './components/drawCharacter.vue';
import UserProfile from './components/UserProfile.vue';
import TestCard from './components/TestCard.vue';
import CharDetails from './components/CharDetails.vue';
import CharInfo from './components/CharInfo.vue';
import EditProfile from './components/EditProfile.vue';
import TestocrCharacter from './components/TestocrCharacter.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: drawCharacter
        },
        {
            path: '/learning',
            name: 'learning',
            component: LearningCards
        },
        {
            path: '/characters',
            name: 'characters',
            component: HSKLevelCharacters
        },
        {
            path: '/register',
            name: 'Register',
            component: UserRegister,
        },
        {
            path: '/login',
            name: 'Login',
            component: UserLogin,
        },
        {
            path: '/scan',
            name: 'Scan',
            component: ScanCharacters,
        },
        {
            path: '/card/:cardId',
            name: 'CardDetails',
            component: CardDetails
        },
        {
            path: '/char-details/:characterId',
            name: 'CharDetails',
            component: CharDetails
        },
        {
            path: '/profile',
            name: 'UserProfile',
            component: UserProfile
        },
        {
            path: '/test',
            name: 'TestCard',
            component: TestCard
        },
        {
            path: '/profile/edit',
            name: 'EditProfile',
            component: EditProfile
        },
    ]
});

const app = createApp(App);

app.component('recognize-character', RecognizeCharacter);
app.component('similar-character', SimilarCharacter);
app.component('stroke-order', StrokeOrder);
app.component('character-audio', CharacterAudio);
app.component('learning-cards', LearningCards);
app.component('card-details', CardDetails);
app.component('user-register', UserRegister);
app.component('user-login', UserLogin);
app.component('navigation-bar', NavigationBar);
app.component('hskLevel-characters', HSKLevelCharacters);
app.component('category-modal', CategoryModal);
app.component('draw-character', drawCharacter);
app.component('test-card', TestCard);
app.component('Testocr-character', TestocrCharacter);
app.component('char-details', CharDetails);
app.component('char-info', CharInfo);
app.component('edit-profile', EditProfile);

app.use(router);

app.config.globalProperties.$axios = axios;

app.use(Toast, {
    position: POSITION.TOP_CENTER,
    timeout: 2500
});

app.mount('#app');
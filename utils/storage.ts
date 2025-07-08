import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Salva o token e os dados do usuário no armazenamento local.
 * @param token Token de autenticação
 * @param userData Dados do usuário (id, name, email, role)
 */
export async function logar(token: string, userData: any) {
    try {
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
        console.error('Erro ao salvar os dados de login:', error);
    }
}

/**
 * Remove todos os dados de autenticação do armazenamento local.
 */
export async function deslogar() {
    try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userData');
    } catch (error) {
        console.error('Erro ao deslogar:', error);
    }
}

/**
 * Verifica se o usuário está logado (se existe um token).
 * @returns True se o token existir, false caso contrário.
 */
export async function verificaSeLogado(): Promise<boolean> {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return !!token; // Retorna true se o token existir
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        return false;
    }
}

/**
 * Obtém o token de autenticação do armazenamento local.
 * @returns Token de autenticação ou null
 */
export async function obterToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem('authToken');
    } catch (error) {
        console.error('Erro ao obter o token:', error);
        return null;
    }
}

/**
 * Obtém os dados do usuário do armazenamento local.
 * @returns Dados do usuário ou null
 */
export async function obterDadosUsuario(): Promise<any | null> {
    try {
        const userData = await AsyncStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        return null;
    }
}

/**
 * Obtém o ID do usuário do armazenamento local.
 * @returns ID do usuário ou null
 */
export async function obterUserId(): Promise<number | null> {
    try {
        const userData = await obterDadosUsuario();
        return userData ? userData.id : null;
    } catch (error) {
        console.error('Erro ao obter o ID do usuário:', error);
        return null;
    }
}

/**
 * Obtém o nome do usuário do armazenamento local.
 * @returns Nome do usuário ou null
 */
export async function obterNomeUsuario(): Promise<string | null> {
    try {
        const userData = await obterDadosUsuario();
        return userData ? userData.name : null;
    } catch (error) {
        console.error('Erro ao obter o nome do usuário:', error);
        return null;
    }
}
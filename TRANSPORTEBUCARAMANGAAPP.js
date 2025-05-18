// ATENCIÓN: Los errores de compilación como "Could not resolve 'react-native'" o 
// "Could not resolve '@react-navigation/native'" indican que el entorno de
// ejecución/previsualización actual no tiene estas bibliotecas de React Native
// fundamentales preinstaladas o configuradas en su proceso de empaquetado (bundling).
// Este es un problema común en entornos de vista previa web que no están completamente
// configurados para ejecutar proyectos React Native nativos.
//
// Para desarrollar y ejecutar esta aplicación localmente, DEBES seguir estos pasos:
// 1. Asegúrate de tener Node.js y Watchman instalados.
// 2. Configura el entorno de desarrollo de React Native siguiendo la guía oficial
//    (https://reactnative.dev/docs/environment-setup) para "React Native CLI Quickstart".
//    Esto incluye la instalación de Android Studio (para Android) y Xcode (para iOS).
// 3. Crea un nuevo proyecto React Native:
//    npx react-native init TransporteBucaramangaApp
// 4. Navega al directorio del proyecto:
//    cd TransporteBucaramangaApp
// 5. Instala las dependencias necesarias DENTRO de tu proyecto:
//    npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
//    npm install react-native-screens react-native-safe-area-context
//    npm install react-native-vector-icons
//    npm install react-native-qrcode-svg
// 6. Para iOS, después de instalar los paquetes, navega a la carpeta `ios` y ejecuta `pod install`:
//    cd ios && pod install && cd ..
// 7. Reemplaza el contenido del archivo App.js (o el archivo principal de tu proyecto) con este código.
// 8. Luego ejecuta la app en un emulador/simulador o dispositivo físico:
//    npx react-native run-android
//    o
//    npx react-native run-ios
//
// El siguiente código es una aplicación React Native estándar y espera que estas
// dependencias estén disponibles en un entorno de desarrollo React Native correctamente configurado.

// Importaciones generales de React y React Native
import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native'; // Este es el paquete fundamental de React Native

// Importaciones de React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importación para iconos (ejemplo con Ionicons de react-native-vector-icons)
import Icon from 'react-native-vector-icons/Ionicons';

// Importación para generar códigos QR
import QRCode from 'react-native-qrcode-svg';

// --- Contexto de Autenticación (Simulado) ---
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null si no está logueado, objeto de usuario si está logueado
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga inicial y verificación de sesión
  useEffect(() => {
    setTimeout(() => {
      // Aquí iría la lógica para verificar si hay un token guardado, etc.
      // Por ahora, asumimos que no hay usuario logueado al inicio.
      setUser(null);
      setIsLoading(false);
    }, 1500);
  }, []);

  const login = async (email, password) => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'usuario@test.com' && password === 'password') {
          setUser({ id: '1', email: 'usuario@test.com', name: 'Juan Pérez' });
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'Credenciales incorrectas' });
        }
      }, 1000);
    });
  };

  const register = async (name, email, password) => {
     // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({ id: '2', email: email, name: name });
        resolve({ success: true });
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Contexto de Conectividad (Simulado) ---
const ConnectivityContext = createContext();

const ConnectivityProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false); // true si está offline

  // Simular cambios de conectividad (en una app real se usaría NetInfo de @react-native-community/netinfo)
  useEffect(() => {
    const interval = setInterval(() => {
      // setIsOffline(prev => !prev); // Descomentar para simular cambios de conectividad
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isOffline, setIsOffline }}>
      {children}
    </ConnectivityContext.Provider>
  );
};

// --- Componente de Aviso Offline ---
const OfflineNotice = () => {
  const { isOffline } = useContext(ConnectivityContext);

  if (!isOffline) {
    return null;
  }

  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>Modo Offline Activo</Text>
    </View>
  );
};

// --- Pantallas de Autenticación ---
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingrese correo y contraseña.');
      return;
    }
    setLoading(true);
    const response = await login(email, password);
    setLoading(false);
    if (!response.success) {
      Alert.alert('Error de Inicio de Sesión', response.message || 'No se pudo iniciar sesión.');
    }
    // El cambio de pantalla se maneja automáticamente por el Stack Navigator al cambiar el estado 'user'
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>Bienvenido</Text>
      <Text style={styles.authSubtitle}>Sistema de Transporte Bucaramanga</Text>
      <TextInput
        style={styles.authInput}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.authInput}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.authButton} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.authButtonText}>Iniciar Sesión</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.authLinkText}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
    setLoading(true);
    const response = await register(name, email, password);
    setLoading(false);
    if (!response.success) {
       Alert.alert('Error de Registro', response.message || 'No se pudo completar el registro.');
    }
    // El cambio de pantalla se maneja automáticamente
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>Crear Cuenta</Text>
      <TextInput
        style={styles.authInput}
        placeholder="Nombre Completo"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.authInput}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.authInput}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.authButton} onPress={handleRegister} disabled={loading}>
         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.authButtonText}>Registrarse</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.authLinkText}>¿Ya tienes cuenta? Inicia Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Pantallas Principales (dentro de Bottom Tabs) ---
const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { isOffline } = useContext(ConnectivityContext);
  const [saldo, setSaldo] = useState(15.50); // Saldo simulado

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hola, {user?.name || 'Usuario'}</Text>
        <Text style={styles.headerSubtitle}>Saldo Actual: ${saldo.toFixed(2)}</Text>
      </View>

      {isOffline && <Text style={styles.offlineWarning}>Estás operando en modo offline. Algunas funciones pueden estar limitadas.</Text>}

      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('BuyTicket')}>
          <Icon name="ticket-outline" size={40} color="#007AFF" />
          <Text style={styles.gridItemText}>Comprar Tiquete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('MyTickets')}>
          <Icon name="qr-code-outline" size={40} color="#007AFF" />
          <Text style={styles.gridItemText}>Mis Tiquetes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Routes')}>
          <Icon name="map-outline" size={40} color="#007AFF" />
          <Text style={styles.gridItemText}>Ver Rutas</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Wallet')}>
          <Icon name="wallet-outline" size={40} color="#007AFF" />
          <Text style={styles.gridItemText}>Recargar Saldo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones Recientes</Text>
        {/* Simulación de notificaciones */}
        <View style={styles.notificationItem}>
          <Text style={styles.notificationText}>Ruta P8 presenta demoras leves.</Text>
          <Text style={styles.notificationTime}>Hace 5 min</Text>
        </View>
        <View style={styles.notificationItem}>
          <Text style={styles.notificationText}>¡Nuevo beneficio! 10% de descuento en tu próxima recarga.</Text>
          <Text style={styles.notificationTime}>Hace 1 hora</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const BuyTicketScreen = ({ navigation }) => {
  const { isOffline } = useContext(ConnectivityContext);
  const [cantidad, setCantidad] = useState(1);
  const precioPorTiquete = 2.80; // Precio simulado

  const handleBuy = () => {
    if (isOffline) {
      Alert.alert("Modo Offline", "La compra de nuevos tiquetes no está disponible sin conexión. Puedes usar tus tiquetes pre-comprados.");
      return;
    }
    // Lógica de compra simulada
    Alert.alert("Compra Exitosa", `Has comprado ${cantidad} tiquete(s). Total: $${(cantidad * precioPorTiquete).toFixed(2)}. Serás redirigido a 'Mis Tiquetes'.`);
    // Aquí se añadiría el tiquete a una lista global o se guardaría en AsyncStorage
    navigation.navigate('MyTickets', { newTicketId: `TICKET-${Date.now()}` });
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.pageTitle}>Comprar Tiquetes</Text>
      <View style={styles.buyTicketForm}>
        <Text style={styles.label}>Cantidad de Tiquetes:</Text>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={() => setCantidad(Math.max(1, cantidad - 1))} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{cantidad}</Text>
          <TouchableOpacity onPress={() => setCantidad(cantidad + 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.totalPriceText}>Precio por tiquete: ${precioPorTiquete.toFixed(2)}</Text>
        <Text style={styles.totalPriceText}>Total a Pagar: <Text style={{fontWeight: 'bold'}}>$${(cantidad * precioPorTiquete).toFixed(2)}</Text></Text>

        <TouchableOpacity style={styles.primaryButton} onPress={handleBuy}>
          <Text style={styles.primaryButtonText}>Pagar y Generar Tiquetes</Text>
        </TouchableOpacity>
        {isOffline && <Text style={styles.offlineInfoText}>La compra online no está disponible en modo offline.</Text>}
      </View>
    </View>
  );
};

const MyTicketsScreen = ({ navigation, route }) => {
  const { isOffline } = useContext(ConnectivityContext);
  // Simulación de tiquetes. En una app real, esto vendría de un estado global (Context/Redux) o AsyncStorage.
  const [tickets, setTickets] = useState([
    { id: 'TICKET-123', type: 'Normal', purchaseDate: '2024-05-05 10:00', status: 'Disponible', qrValue: 'BUCARAMANGA-TRANSPORT-TICKET-123-VALID-50MIN' },
    { id: 'TICKET-456', type: 'Estudiante', purchaseDate: '2024-05-04 15:30', status: 'Usado', qrValue: 'BUCARAMANGA-TRANSPORT-TICKET-456-USED' },
  ]);

  useEffect(() => {
    if (route.params?.newTicketId) {
      const newTicket = {
        id: route.params.newTicketId,
        type: 'Normal',
        purchaseDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'Disponible',
        qrValue: `BUCARAMANGA-TRANSPORT-${route.params.newTicketId}-VALID-50MIN`
      };
      setTickets(prevTickets => [newTicket, ...prevTickets]);
      // Limpiar params para evitar añadirlo múltiples veces si se navega atrás y adelante
      navigation.setParams({ newTicketId: null });
    }
  }, [route.params?.newTicketId, navigation]);


  const renderTicketItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.ticketItem, item.status === 'Usado' && styles.ticketItemUsed]}
      onPress={() => item.status === 'Disponible' && navigation.navigate('TicketDetail', { ticket: item })}
    >
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketId}>ID: {item.id}</Text>
        <Text style={styles.ticketDate}>Comprado: {item.purchaseDate}</Text>
        <Text style={styles.ticketStatus}>Estado: {item.status}</Text>
      </View>
      {item.status === 'Disponible' && <Icon name="chevron-forward-outline" size={24} color="#007AFF" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.pageTitle}>Mis Tiquetes</Text>
      {isOffline && <Text style={styles.offlineInfoText}>Mostrando tiquetes almacenados localmente.</Text>}
      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyListText}>No tienes tiquetes disponibles.</Text>}
      />
    </View>
  );
};

const TicketDetailScreen = ({ route }) => {
  const { ticket } = route.params;
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutos en segundos
  const [isActive, setIsActive] = useState(false); // Simula si el tiquete ha sido validado por primera vez

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer); // Detener antes de llegar a 0 o negativo
            Alert.alert("Tiquete Expirado", `El tiquete ${ticket.id} ha expirado.`);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, ticket.id]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleActivateTicket = () => {
    // Simulación de la primera validación NFC/QR
    if (!isActive) {
        Alert.alert("Tiquete Activado", "Tu tiquete ahora es válido por 50 minutos para transbordos.");
        setIsActive(true);
        // El temporizador comenzará gracias al useEffect
    }
  };


  return (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.pageTitle}>Detalle del Tiquete</Text>
      <View style={styles.ticketDetailCard}>
        <Text style={styles.ticketDetailId}>ID Tiquete: {ticket.id}</Text>
        <Text style={styles.ticketDetailInfo}>Tipo: {ticket.type}</Text>
        <Text style={styles.ticketDetailInfo}>Fecha de Compra: {ticket.purchaseDate}</Text>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={ticket.qrValue} // El valor del QR que leerá el validador
            size={Dimensions.get('window').width * 0.6}
            color="black"
            backgroundColor="white"
          />
        </View>
        <Text style={styles.qrInstruction}>Presenta este código QR para validar tu viaje.</Text>
        
        {!isActive && (
          <TouchableOpacity style={styles.primaryButton} onPress={handleActivateTicket}>
            <Text style={styles.primaryButtonText}>Simular Primera Validación</Text>
          </TouchableOpacity>
        )}

        {isActive && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>Tiempo restante para transbordos:</Text>
            <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
            {timeLeft === 0 && <Text style={styles.expiredText}>TIQUETE EXPIRADO</Text>}
          </View>
        )}
        <Text style={styles.ticketValidityInfo}>Válido por 50 minutos desde la primera validación para múltiples transbordos.</Text>
      </View>
    </ScrollView>
  );
};


const RoutesScreen = () => {
  // Datos simulados de rutas
  const routesData = [
    { id: 'P8', name: 'P8: Piedecuesta - Centro', frequency: 'Cada 10 min', company: 'Transporte Veloz' },
    { id: 'A1', name: 'A1: Cañaveral - UIS', frequency: 'Cada 15 min', company: 'Movilidad Urbana' },
    { id: 'T3', name: 'T3: Girón - Provenza', frequency: 'Cada 8 min', company: 'Metrolinea' },
    { id: 'R10', name: 'R10: Real de Minas - Cabecera', frequency: 'Cada 12 min', company: 'Transporte Oriental' },
  ];

  const renderRouteItem = ({ item }) => (
    <View style={styles.routeItem}>
      <Icon name="bus-outline" size={30} color="#4CAF50" style={styles.routeIcon} />
      <View style={styles.routeInfo}>
        <Text style={styles.routeName}>{item.name}</Text>
        <Text style={styles.routeDetail}>Frecuencia: {item.frequency}</Text>
        <Text style={styles.routeDetail}>Empresa: {item.company}</Text>
      </View>
      <TouchableOpacity onPress={() => Alert.alert("Ver Mapa", `Mostrando mapa para la ruta ${item.id}`)}>
         <Icon name="navigate-circle-outline" size={28} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.pageTitle}>Rutas Disponibles</Text>
      <FlatList
        data={routesData}
        renderItem={renderRouteItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const WalletScreen = () => {
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(15.50); // Simulado

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Ingrese un monto válido para recargar.");
      return;
    }
    // Simulación de recarga
    setCurrentBalance(prev => prev + amount);
    setRechargeAmount('');
    Alert.alert("Recarga Exitosa", `Se han añadido $${amount.toFixed(2)} a tu saldo.`);
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.pageTitle}>Mi Billetera</Text>
      <View style={styles.walletCard}>
        <Text style={styles.balanceLabel}>Saldo Actual:</Text>
        <Text style={styles.balanceAmount}>${currentBalance.toFixed(2)}</Text>
      </View>

      <View style={styles.rechargeSection}>
        <Text style={styles.sectionTitle}>Recargar Saldo</Text>
        <TextInput
          style={styles.authInput} // Reutilizando estilo de input
          placeholder="Monto a recargar (ej: 10.00)"
          keyboardType="numeric"
          value={rechargeAmount}
          onChangeText={setRechargeAmount}
        />
        {/* Aquí iría la selección de método de pago */}
        <Text style={styles.paymentMethodInfo}>Método de pago: Tarjeta Visa **** 1234 (Simulado)</Text>
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleRecharge}>
          <Text style={styles.primaryButtonText}>Confirmar Recarga</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de Transacciones (Billetera)</Text>
        {/* Simulación de historial */}
        <View style={styles.transactionItem}>
            <Text>Recarga Exitosa</Text>
            <Text style={{color: 'green'}}>+$20.00</Text>
        </View>
        <View style={styles.transactionItem}>
            <Text>Compra de Tiquete</Text>
            <Text style={{color: 'red'}}>- $2.80</Text>
        </View>
      </View>
    </ScrollView>
  );
};


const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.pageTitle}>Mi Perfil</Text>
      <View style={styles.profileCard}>
        <Icon name="person-circle-outline" size={80} color="#007AFF" style={{alignSelf: 'center', marginBottom: 10}} />
        <Text style={styles.profileInfo}>Nombre: {user?.name}</Text>
        <Text style={styles.profileInfo}>Correo: {user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.profileOption}>
        <Icon name="card-outline" size={24} color="#444" />
        <Text style={styles.profileOptionText}>Métodos de Pago</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileOption}>
        <Icon name="notifications-outline" size={24} color="#444" />
        <Text style={styles.profileOptionText}>Preferencias de Notificación</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileOption}>
        <Icon name="help-circle-outline" size={24} color="#444" />
        <Text style={styles.profileOptionText}>Ayuda y Soporte</Text>
      </TouchableOpacity>
       <TouchableOpacity style={styles.profileOption}>
        <Icon name="shield-checkmark-outline" size={24} color="#444" />
        <Text style={styles.profileOptionText}>Seguridad y Privacidad</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.authButton, {backgroundColor: '#FF3B30', marginTop: 30}]} onPress={logout}>
        <Text style={styles.authButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// --- Navegadores ---
const AuthStack = createStackNavigator();
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const HomeStack = createStackNavigator();
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#007AFF'},
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold'}
  }}>
    <HomeStack.Screen name="Inicio" component={HomeScreen} options={{ title: 'Transporte Bucaramanga'}}/>
    <HomeStack.Screen name="BuyTicket" component={BuyTicketScreen} options={{ title: 'Comprar Tiquete' }} />
    <HomeStack.Screen name="MyTickets" component={MyTicketsScreen} options={{ title: 'Mis Tiquetes' }} />
    <HomeStack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ title: 'Detalle del Tiquete' }} />
    {/* Se podría añadir WalletScreen aquí si se accede desde HomeScreen directamente */}
    {/* <HomeStack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Recargar Saldo' }} /> */}
  </HomeStack.Navigator>
);

const RoutesStack = createStackNavigator();
const RoutesStackNavigator = () => (
 <RoutesStack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#007AFF'},
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold'}
  }}>
    <RoutesStack.Screen name="RoutesList" component={RoutesScreen} options={{ title: 'Consultar Rutas'}} />
    {/* Aquí podrían ir pantallas de detalle de ruta, mapa interactivo, etc. */}
  </RoutesStack.Navigator>
);

const WalletStack = createStackNavigator();
const WalletStackNavigator = () => (
 <WalletStack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#007AFF'},
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold'}
  }}>
    <WalletStack.Screen name="WalletMain" component={WalletScreen} options={{ title: 'Mi Billetera'}} />
  </WalletStack.Navigator>
);


const ProfileStack = createStackNavigator();
const ProfileStackNavigator = () => (
 <ProfileStack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#007AFF'},
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold'}
  }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Mi Perfil'}} />
  </ProfileStack.Navigator>
);


const Tab = createBottomTabNavigator();
const AppTabsNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Principal') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Rutas') {
          iconName = focused ? 'map' : 'map-outline';
        } else if (route.name === 'Billetera') {
          iconName = focused ? 'wallet' : 'wallet-outline';
        } else if (route.name === 'Perfil') {
          iconName = focused ? 'person-circle' : 'person-circle-outline';
        }
        // Fallback icon if needed
        if (!iconName) iconName = 'ellipse-outline'; 
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false, // Ocultamos el header del TabNavigator porque cada Stack ya tiene el suyo
    })}
  >
    <Tab.Screen name="Principal" component={HomeStackNavigator} />
    <Tab.Screen name="Rutas" component={RoutesStackNavigator} />
    <Tab.Screen name="Billetera" component={WalletStackNavigator} />
    <Tab.Screen name="Perfil" component={ProfileStackNavigator} />
  </Tab.Navigator>
);


// --- Componente Principal de la App ---
const App = () => {
  return (
    <AuthProvider>
      <ConnectivityProvider>
        <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor="#007AFF" />
        <OfflineNotice />
        <MainNavigator />
      </ConnectivityProvider>
    </AuthProvider>
  );
};

const MainNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#007AFF"/>
        <Text style={{marginTop: 10, fontSize: 16, color: '#333'}}>Cargando aplicación...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppTabsNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  // Contenedores de Autenticación
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  authInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  authButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authLinkText: {
    color: '#007AFF',
    marginTop: 20,
    fontSize: 16,
  },

  // Contenedores de Pantallas
  screenContainer: {
    flex: 1,
    backgroundColor: '#F0F2F5', 
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginLeft: 5, 
  },
  
  // Header en HomeScreen
  header: {
    paddingVertical: 20,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },

  // Grid en HomeScreen
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: (Dimensions.get('window').width - 50) / 2, 
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 120,
  },
  gridItemText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

  // Secciones generales
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },

  // Notificaciones
  notificationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  notificationText: {
    fontSize: 15,
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  
  // Comprar Tiquete
  buyTicketForm: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    color: '#333',
  },
  totalPriceText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Mis Tiquetes
  ticketItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF', 
  },
  ticketItemUsed: {
    borderLeftColor: '#8E8E93', 
    opacity: 0.7,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketDate: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
  ticketStatus: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
    fontWeight: '500',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#777',
  },

  // Detalle del Tiquete
  ticketDetailCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  ticketDetailId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  ticketDetailInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  qrContainer: {
    marginVertical: 25,
    padding: 10,
    backgroundColor: 'white', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  qrInstruction: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#E8F0FE',
    borderRadius: 8,
    width: '100%',
  },
  timerText: {
    fontSize: 16,
    color: '#0052cc',
  },
  timerValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0052cc',
    marginTop: 5,
  },
  expiredText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 10,
  },
  ticketValidityInfo: {
      fontSize: 13,
      color: '#666',
      textAlign: 'center',
      marginTop: 15,
      fontStyle: 'italic'
  },

  // Rutas
  routeItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeIcon: {
    marginRight: 15,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  routeDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },

  // Billetera
  walletCard: {
    backgroundColor: '#007AFF',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#E0E0E0', 
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 5,
  },
  rechargeSection: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  paymentMethodInfo: {
    fontSize: 14,
    color: '#666',
    marginVertical: 15,
    textAlign: 'center',
  },
  transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#EEE',
      // fontSize: 15, // Ya está implícito por los Text dentro
  },


  // Perfil
  profileCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center', // Centrar contenido de la tarjeta de perfil
  },
  profileInfo: {
    fontSize: 17,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'
  },
  profileOption: {
    backgroundColor: '#FFF',
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },

  // Aviso Offline
  offlineContainer: {
    backgroundColor: '#FFCC00', 
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    // position: 'absolute', // Puede causar problemas con Safe Area View o headers
    // top: Platform.OS === 'ios' ? (StatusBar.currentHeight || 20) : StatusBar.currentHeight, 
    zIndex: 1000,
  },
  offlineText: {
    color: '#333', 
    fontSize: 14,
    fontWeight: '500',
  },
  offlineWarning: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  offlineInfoText: {
      textAlign: 'center',
      color: '#666',
      fontStyle: 'italic',
      marginBottom: 10,
      fontSize: 13,
  }
});

export default App;

import React from 'react';
import Libs from './components/Libs';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import Registration from './components/Registration';
import { AuthProvider } from './components/auth-context';
import { Products } from './components/Products';
import Login from './components/Login';
import ClothesAdmin from './components/clothes-management';
import Logout from './components/Logout'
import { About } from './components/About';
import { Cart } from './components/Cart';
import './custom.css'
import Contact from './components/Contact';
import Checkout from './components/Checkout';
import OrderSuccessPage from './components/order-success';

const App = () => {
    return (
        <AuthProvider>
          <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/fetch-data' component={FetchData} />
            <Route path='/register' component={Registration} />
            <Route path='/login' component={Login} />
            <Route path='/manage' component={ClothesAdmin} />
            <Route path='/logout' component={Logout} />
            <Route path='/products' component={Products} />
            <Route path='/about' component={About} />
            <Route path='/contact' component={Contact} />
            <Route path='/cart' component={Cart} />
            <Route path='/checkout' component={Checkout} />
            <Route path="/order-success/:orderId" component={OrderSuccessPage} />
          </Layout>
        </AuthProvider>
    );
}

export default App;

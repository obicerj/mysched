import mysql from 'mysql2/promise';
import { GetDBSettings } from './utils';

// initialize a connection pool
const connectionPool = mysql.createPool(GetDBSettings());
export default connectionPool;

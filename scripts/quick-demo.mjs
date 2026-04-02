/**
 * Küçük deneme: kütüphaneyi kodla çağırmak için.
 * Proje kökünde: npm run build && node scripts/quick-demo.mjs
 */
import { firstName, email } from "../dist/index.js";

console.log("Sahte isim:", firstName());
console.log("Sahte mail:", email());
console.log("Bir daha:", firstName(), email());

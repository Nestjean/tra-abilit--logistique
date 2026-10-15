import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [produits, setProduits] = useState([]);
  const [code, setCode] = useState("");
  const [nom, setNom] = useState("");
  const [erreur, setErreur] = useState("");

  async function chargerProduits() {
    const response = await fetch("/api/produits");

    if (!response.ok) {
      throw new Error("Impossible de charger les produits");
    }

    const data = await response.json();
    setProduits(data);
  }

  useEffect(() => {
    chargerProduits().catch((error) => {
      setErreur(error.message);
    });
  }, []);

  async function ajouterProduit(e) {
    e.preventDefault();
    setErreur("");

    try {
      const response = await fetch("/api/produits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, nom }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erreur || "Erreur inconnue");
      }

      setCode("");
      setNom("");

      await chargerProduits();
    } catch (error) {
      setErreur(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold">
          Traçabilité logistique
        </h1>

        <p className="mb-8 text-slate-400">
          Gestion des produits
        </p>

        <form
          onSubmit={ajouterProduit}
          className="mb-8 space-y-4 rounded-xl bg-slate-900 p-6"
        >
          <h2 className="text-xl font-semibold">
            Ajouter un produit
          </h2>

          <input
            type="text"
            placeholder="Code produit"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={50}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />

          <input
            type="text"
            placeholder="Nom du produit"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            maxLength={150} 
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700"
          >
            Ajouter
          </button>
        </form>

        {erreur && (
          <p className="mb-4 text-red-400">{erreur}</p>
        )}

        <h2 className="mb-4 text-xl font-semibold">
          Liste des produits
        </h2>

        <div className="space-y-3">
          {produits.map((produit) => (
            <div
              key={produit.id}
              className="flex items-center justify-between rounded-lg bg-slate-900 p-4"
            >
              <span>{produit.nom}</span>

              <span className="text-sm text-blue-400">
                {produit.code}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;


import { useNavigate } from "react-router-dom";
import eplLogo from "../../../../assets/leagues/epl.png";
import laLigaLogo from "../../../../assets/leagues/laliga.png";
import serieALogo from "../../../../assets/leagues/seriea.png";
import bundesligaLogo from "../../../../assets/leagues/bundesliga.png";
import ligue1Logo from "../../../../assets/leagues/ligue1.png";


function ShopByLeague() {
    const navigate = useNavigate();

    const leagues = [
        { name: "Premier League", logo: eplLogo },
        { name: "La Liga", logo: laLigaLogo },
        { name: "Serie A", logo: serieALogo },
        { name: "Bundesliga", logo: bundesligaLogo },
        { name: "Ligue 1", logo: ligue1Logo },
    ];

    const handleLeagueClick = (league) => {
        // Navigate to shop page with league as query param
        navigate(`/shop?league=${league}`);
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-10">
                    Shop by <span className="text-green-600">League</span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {leagues.map((league, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleLeagueClick(league.name)}
                            className="cursor-pointer bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center group"
                        >
                            <img
                                src={league.logo}
                                alt={league.name}
                                className="h-20 w-20 object-contain mb-4 group-hover:scale-110 transition-transform"
                            />
                            <p className="font-semibold text-gray-700 group-hover:text-green-600">
                                {league.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


export default ShopByLeague;
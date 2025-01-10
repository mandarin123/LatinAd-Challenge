import { Button, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player'

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/search');
  };

  return (
    <>
      <div
        className="relative h-[60vh] w-full"
        style={{
          background: 'linear-gradient(0deg, rgb(57, 150, 243), rgb(66, 165, 245))',
        }}
      >
        <div
          className="absolute bottom-0 right-0 w-[70%] h-[90%] hidden md:block"
          style={{
            backgroundImage: 'url(/latinad-bg.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'right bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="relative z-10 container lg:mx-20 xl:mx-20 px-4 pt-20">
          <div className="max-w-xl mx-auto md:mx-0">
            <div className='flex flex-row justify-center md:justify-start'>
              <h1 className="text-white text-6xl font-thin mb-2">
                Latin
              </h1>
              <h1 className="text-white text-6xl font-bold mb-2">
                AD
              </h1>
            </div>

            <h1 className="text-white text-4xl mb-6 text-center md:text-left">
              Mejora el alcance de tu marca
            </h1>

            <p className="text-white text-xl mb-8 font-light max-w-md text-center md:text-left">
              Crea campañas fuera de casa en minutos y alcanza a miles de personas
            </p>

            <div className="flex justify-center md:justify-start">
              <Button
                type="primary"
                size="large"
                className="bg-[#16295e] hover:bg-[#2563eb] border-2 border-white rounded-full px-8"
                onClick={handleClick}
              >
                Busca pantallas
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[100vh] bg-white text-center flex flex-col">
        <p className='mt-20 text-4xl text-font-dark font-bold'>
          Descubre la última tecnología en publicidad exterior
        </p>
        <p className='text-3xl text-font-light mb-16'>
          Comunica tu marca a miles de personas inteligentemente
        </p>

        <div className="container mx-auto w-full mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between">
            <div className="flex flex-col items-center">
              <Image
                src="/image1.png"
                alt="Sin intermediarios"
                preview={false}
                width={200}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold text-[#16295e] mb-2">
                Sin intermediarios
              </h3>
            </div>

            <div className="flex flex-col items-center">
              <Image
                src="/image2.png"
                alt="Sin llamadas"
                preview={false}
                width={200}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold text-[#16295e] mb-2">
                Sin llamadas
              </h3>
            </div>

            <div className="flex flex-col items-center">
              <Image
                src="/image3.png"
                alt="100% Online"
                preview={false}
                width={200}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold text-[#16295e] mb-2">
                100% Online
              </h3>
            </div>
          </div>
        </div>
        <div className='w-full h-[50vh] flex justify-center items-center px-4 md:px-0'>
          <div className='w-full md:w-1/2'>
            <ReactPlayer
              url="https://youtu.be/OuK39XikxpY"
              width="100%"
              height="100%"
              className="aspect-video"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
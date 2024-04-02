import '@/app/components/Marquee.css';

const Banner = () => {
  return (
    <div className="
      h-min mt-1 py-2 overflow-hidden
      border border-black rounded-lg bg-white
      text-black  
    ">
      <div className="marquee w-screen">
        <span className="inline-block px-4">요즘 잡 마켓 실화냐? 엔트리 레벨 뒤지겠네 진짜 굶어 뒤지것네</span>
      </div>
    </div>
  )
}

export default Banner
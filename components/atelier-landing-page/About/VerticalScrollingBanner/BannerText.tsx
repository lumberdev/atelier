const BannerText = () => {
  return (
    <div className="flex flex-1 flex-col gap-[1.875rem] text-center text-4xl italic text-brand-2 md:text-start md:text-5xl lg:text-[3.5rem] xl:text-7xl [&>*]:font-brand-body [&>*]:font-light">
      <p>sample sales</p>
      <p>early access</p>
      <p>limited editions</p>
      <p>influencer stores</p>
      <p>brand collaborations</p>
      <p>merch stores</p>
      <p>employee stores</p>
    </div>
  );
};

export default BannerText;

import { ImageResponse } from 'next/og';
import { getAnalysisBySlug } from '@/lib/analysis-store';
import { getScoreBand } from '@/lib/utils';
import { getRankedBrands } from '@/lib/sponsor-engine';
export const alt = 'Cooked website roast';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';
export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;
  const [analysis, sponsors] = await Promise.all([getAnalysisBySlug(slug), getRankedBrands()]);
  if (!analysis) return new Response('Result not found', {status:404});
  const sponsor = sponsors[0];
  return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',background:'#0B0F11',color:'#FAFAFA',padding:44,fontFamily:'sans-serif'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}><span style={{fontSize:32,fontWeight:900}}>COOKED<span style={{color:'#FF552E'}}>.</span></span><span style={{fontSize:18,color:'#A8B0B5'}}>am-i-cooked.lol</span></div>
    <div style={{display:'flex',flex:1,border:'1px solid #3A4247',padding:30,gap:30}}>
      <div style={{display:'flex',flexDirection:'column',width:720}}>
        <span style={{fontSize:analysis.hostname.length>25?30:40,fontWeight:700}}>{analysis.hostname.slice(0,48)}</span>
        <div style={{display:'flex',fontSize:84,fontWeight:900,lineHeight:1.2}}><span style={{color:'#FF552E'}}>{analysis.totalScore}%</span>&nbsp;COOKED</div>
        <span style={{fontSize:20,color:'#FF8A45',marginTop:6}}>{getScoreBand(analysis.totalScore).name.toUpperCase()}</span>
        <span style={{fontSize:30,fontWeight:700,marginTop:24}}>{analysis.archetype}</span>
        <span style={{fontSize:analysis.finalVerdict.length > 80 ? 20 : 24,color:'#A8B0B5',marginTop:10}}>{analysis.finalVerdict.slice(0, 120)}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',width:230,height:230,border:'16px solid #FF552E',borderRadius:'50%',marginTop:28}}><span style={{fontSize:84,fontWeight:900,lineHeight:1}}>{analysis.totalScore}</span><span style={{fontSize:24,color:'#A8B0B5'}}>/100</span></div>
    </div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:18,fontSize:20}}><div style={{display:'flex',flexDirection:'column'}}><span>CAN YOUR WEBSITE BEAT {analysis.totalScore}?</span><span style={{color:'#A8B0B5',fontSize:16}}>Lower score wins. Take the challenge.</span></div>{sponsor && <div style={{display:'flex',alignItems:'center',gap:14,border:'1px solid #FF552E',padding:'10px 16px'}}>{sponsor.logoSvg && <img src={sponsor.logoSvg} alt="" width="42" height="42" style={{objectFit:'contain'}} />}<div style={{display:'flex',flexDirection:'column'}}><span style={{fontSize:12,color:'#FF8A45'}}>TOP HEAT · #1 · ${sponsor.eligibleSpend.toLocaleString()}</span><span style={{fontWeight:800}}>{sponsor.name.slice(0,20)}</span></div></div>}</div>
  </div>,size);
}

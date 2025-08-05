/*************************************************************************************************
* Sam MedLab - Final & Complete Application Code
* Version: 5.0 (All Features Included)
*
* Features:
* - Searchable Medical Test Database
* - Graduation Research Section
* - AI Assistant (SAM-GIMS) powered by Gemini API
* - Digital Store for Medical Products
*
* Instructions: This is the final code to be pasted into the `src/App.jsx` file
* as per the developer guide.
*************************************************************************************************/

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Beaker, Droplet, TestTube, Stethoscope, ChevronRight, X, Bug, GraduationCap, Sparkles, Send, ShoppingCart } from 'lucide-react';

// --- Database & Icons (Truncated for brevity in this comment block) ---
const labTestsData = [
    { id: 1, category: "أمراض الدم", name: "صورة الدم الكاملة (CBC)", description: "فحص شامل يقيم الأنواع المختلفة من الخلايا في الدم: كريات الدم الحمراء، كريات الدم البيضاء، والصفائح الدموية.", specimen: "دم كامل", tube: "أنبوب بنفسجي (EDTA)", preparation: "لا يتطلب صيام.", normalRanges: [{ label: "كريات الدم البيضاء (WBC)", value: "4,500-11,000 خلية/مكل" }, { label: "كريات الدم الحمراء (RBC)", value: "الرجال: 4.7-6.1 م/مكل، النساء: 4.2-5.4 م/مكل" }, { label: "الهيموجلوبين (Hb)", value: "الرجال: 13.8-17.2 غم/دل، النساء: 12.1-15.1 غم/دل" }, { label: "الهيماتوكريت (Hct)", value: "الرجال: 40.7-50.3%، النساء: 36.1-44.3%" }, { label: "الصفائح الدموية (Platelets)", value: "150,000-450,000/مكل" },], interpretation: "القيم غير الطبيعية قد تشير إلى فقر الدم، العدوى، الالتهابات، اضطرابات النزيف أو أمراض أخرى." },
    { id: 7, category: "أمراض الدم", name: "سرعة ترسيب الدم (ESR)", description: "يقيس سرعة ترسب خلايا الدم الحمراء في أنبوب اختبار خلال ساعة واحدة. وهو مؤشر غير محدد للالتهاب.", specimen: "دم كامل", tube: "أنبوب أسود (Sodium Citrate) أو بنفسجي (EDTA)", preparation: "لا يتطلب صيام.", normalRanges: [{ label: "الرجال (< 50 سنة)", value: "0-15 مم/ساعة" }, { label: "النساء (< 50 سنة)", value: "0-20 مم/ساعة" },], interpretation: "ارتفاع القيمة يشير إلى وجود التهاب في الجسم، مثل حالات العدوى، أمراض المناعة الذاتية، أو بعض أنواع السرطان." },
    { id: 2, category: "الكيمياء الحيوية", name: "سكر الدم الصائم (FBS)", description: "يقيس مستوى الجلوكوز في الدم بعد صيام 8-12 ساعة.", specimen: "بلازما أو مصل", tube: "أنبوب رمادي (Sodium Fluoride) أو أحمر/ذهبي", preparation: "صيام 8-12 ساعة.", normalRanges: [{ label: "المستوى الطبيعي", value: "70-99 ملغ/دل" }, { label: "مرحلة ما قبل السكري", value: "100-125 ملغ/دل" }, { label: "تشخيص السكري", value: "≥ 126 ملغ/دل" },], interpretation: "القيم المرتفعة تشير إلى احتمالية الإصابة بمرض السكري. القيم المنخفضة قد تشير إلى نقص السكر في الدم." },
    { id: 8, category: "الكيمياء الحيوية", name: "السكر التراكمي (HbA1c)", description: "يعطي متوسط مستوى السكر في الدم خلال الثلاثة أشهر الماضية.", specimen: "دم كامل", tube: "أنبوب بنفسجي (EDTA)", preparation: "لا يتطلب صيام.", normalRanges: [{ label: "المستوى الطبيعي", value: "< 5.7%" }, { label: "مرحلة ما قبل السكري", value: "5.7% - 6.4%" }, { label: "تشخيص السكري", value: "≥ 6.5%" },], interpretation: "يستخدم لتشخيص ومتابعة السيطرة على مرض السكري على المدى الطويل." },
    { id: 3, category: "الكيمياء الحيوية", name: "وظائف الكلى (Kidney Function)", description: "مجموعة اختبارات لتقييم كفاءة عمل الكلى.", specimen: "مصل الدم", tube: "أنبوب أحمر أو ذهبي", preparation: "قد يتطلب صيام.", normalRanges: [{ label: "الكرياتينين (Creatinine)", value: "0.6-1.3 ملغ/دل" }, { label: "نيتروجين اليوريا (BUN)", value: "7-20 ملغ/دل" }, { label: "حمض اليوريك (Uric Acid)", value: "3.5-7.2 ملغ/دل" },], interpretation: "ارتفاع المستويات قد يدل على وجود قصور في وظائف الكلى أو الجفاف أو النقرس." },
    { id: 9, category: "الكيمياء الحيوية", name: "وظائف الكبد (Liver Function)", description: "مجموعة اختبارات لتقييم صحة الكبد وقدرته على أداء وظائفه.", specimen: "مصل الدم", tube: "أنبوب أحمر أو ذهبي", preparation: "لا يتطلب صيام.", normalRanges: [{ label: "ALT (SGPT)", value: "7-56 وحدة/لتر" }, { label: "AST (SGOT)", value: "10-40 وحدة/لتر" }, { label: "ALP", value: "44-147 وحدة/لتر" }, { label: "البيليروبين الكلي", value: "0.3-1.2 ملغ/دل" }, { label: "الألبومين", value: "3.4-5.4 غم/دل" },], interpretation: "ارتفاع إنزيمات الكبد (ALT, AST) قد يشير إلى تلف خلايا الكبد. التغيرات في البيليروبين والألبومين تعكس قدرة الكبد على المعالجة والتصنيع." },
    { id: 6, category: "الكيمياء الحيوية", name: "ملف الدهون (Lipid Profile)", description: "يقيس مستويات الكوليسترول والدهون الثلاثية لتقييم خطر أمراض القلب.", specimen: "مصل الدم", tube: "أنبوب أحمر أو ذهبي", preparation: "صيام 9-12 ساعة.", normalRanges: [{ label: "الكوليسترول الكلي", value: "< 200 ملغ/دل" }, { label: "الضار (LDL)", value: "< 100 ملغ/دل" }, { label: "النافع (HDL)", value: "> 40 ملغ/دل" }, { label: "الدهون الثلاثية", value: "< 150 ملغ/دل" },], interpretation: "ارتفاع LDL والدهون الثلاثية يزيد من خطر الإصابة بأمراض القلب والأوعية الدموية." },
    { id: 4, category: "الهرمونات", name: "وظائف الغدة الدرقية (TSH, T4, T3)", description: "تقييم وظيفة الغدة الدرقية عن طريق قياس الهرمونات المرتبطة بها.", specimen: "مصل الدم", tube: "أنبوب أحمر أو ذهبي", preparation: "لا يتطلب صيام.", normalRanges: [{ label: "TSH", value: "0.4 - 4.2 mIU/L" }, { label: "Free T4", value: "0.8 - 1.8 ng/dL" }, { label: "Total T3", value: "80 - 220 ng/dL" },], interpretation: "ارتفاع TSH مع انخفاض T4/T3 يشير لقصور الغدة. انخفاض TSH مع ارتفاع T4/T3 يشير لفرط نشاطها." },
    { id: 10, category: "الهرمونات", name: "فيتامين د (Vitamin D, 25-OH)", description: "يقيس مستوى فيتامين د في الجسم، وهو ضروري لصحة العظام والمناعة.", specimen: "مصل الدم", tube: "أنبوب أحمر أو ذهبي", preparation: "لا يتطلب صيام.", normalRanges: [{ label: "نقص", value: "< 20 نانوغرام/مل" }, { label: "غير كافٍ", value: "21-29 نانوغرام/مل" }, { label: "كافٍ (طبيعي)", value: "30-100 نانوغرام/مل" },], interpretation: "النقص شائع وقد يؤدي إلى مشاكل في العظام مثل الكساح وهشاشة العظام وضعف المناعة." },
    { id: 5, category: "تحليل البول", name: "تحليل البول الكامل (Urinalysis)", description: "فحص للبول لتقييم الخصائص الفيزيائية، الكيميائية، والمجهرية.", specimen: "عينة بول صباحية", tube: "وعاء نظيف ومعقم", preparation: "جمع عينة منتصف التبول.", normalRanges: [{ label: "اللون", value: "أصفر فاتح" }, { label: "البروتين", value: "سلبي" }, { label: "الجلوكوز", value: "سلبي" }, { label: "كرات الدم الحمراء", value: "0-2 /HPF" }, { label: "كرات الدم البيضاء", value: "0-5 /HPF" },], interpretation: "وجود البروتين، الجلوكوز، أو زيادة خلايا الدم قد يشير لأمراض الكلى، السكري، أو التهابات المسالك البولية." },
    { id: 11, category: "علم الأمصال والفيروسات", name: "العامل الروماتويدي (RF)", description: "يكشف عن وجود أجسام مضادة ترتبط بالتهاب المفاصل الروماتويدي وأمراض مناعية أخرى.", specimen: "مصل الدم", tube: "أنبوب أحمر أو ذهبي", preparation: "لا يتطلب صيام.", normalRanges: [{ label: "النتيجة الطبيعية", value: "< 15 IU/mL" },], interpretation: "نتيجة إيجابية قد تدعم تشخيص التهاب المفاصل الروماتويدي، لكنها قد تكون إيجابية في حالات أخرى أو لدى الأصحاء." },
    { id: 12, category: "علم الأمصال والفيروسات", name: "فحص التهاب الكبد ب (HBsAg)", description: "يكشف عن وجود المستضد السطحي لفيروس التهاب الكبد الوبائي (B)، مما يدل على عدوى حالية.", specimen: "مصل الدم", tube: "أنبوب أحمر أو ذهبي", preparation: "لا يتطلب صيام.", normalRanges: [{ label: "النتيجة الطبيعية", value: "سلبي (Negative)" },], interpretation: "النتيجة الإيجابية تعني أن الشخص مصاب بعدوى فيروس التهاب الكبد B (إما حادة أو مزمنة)." },
    { id: 13, category: "علم الأمصال والفيروسات", name: "فحص فيروس نقص المناعة (HIV)", description: "يكشف عن الأجسام المضادة لفيروس نقص المناعة البشرية و/أو مولد الضد P24.", specimen: "مصل الدم", tube: "أنبوب أحمر أو ذهبي", preparation: "لا يتطلب صيام.", normalRanges: [{ label: "النتيجة الطبيعية", value: "سلبي (Non-reactive)" },], interpretation: "النتيجة الإيجابية (Reactive) تتطلب اختبارات تأكيدية لتشخيص الإصابة بالفيروس." },
];
const categoryIcons = {
  "الكل": <Beaker className="w-5 h-5 ml-2" />, "أمراض الدم": <Droplet className="w-5 h-5 ml-2" />, "الكيمياء الحيوية": <Beaker className="w-5 h-5 ml-2" />, "الهرمونات": <Stethoscope className="w-5 h-5 ml-2" />, "تحليل البول": <TestTube className="w-5 h-5 ml-2" />, "علم الأمصال والفيروسات": <Bug className="w-5 h-5 ml-2" />,
};

// --- Reusable Modal Components ---
const TestDetailView = ({ test, onClose }) => {
  if (!test) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={onClose}>
        <div dir="rtl" className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700"><X size={24} /></button>
            <h3 className="text-2xl font-bold text-teal-700 mb-4">{test.name}</h3>
            <p className="text-gray-600 mb-6">{test.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-teal-50 p-4 rounded-xl"><h4 className="font-semibold text-teal-800 mb-2">نوع العينة</h4><p className="text-gray-700">{test.specimen}</p></div>
                <div className="bg-green-50 p-4 rounded-xl"><h4 className="font-semibold text-green-800 mb-2">نوع الأنبوب</h4><p className="text-gray-700">{test.tube}</p></div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl mb-6"><h4 className="font-semibold text-yellow-800 mb-2">تحضير المريض</h4><p className="text-gray-700">{test.preparation}</p></div>
            <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-3">القيم الطبيعية</h4>
                <div className="space-y-2">
                {test.normalRanges.map((range, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                    <span className="font-medium text-gray-700">{range.label}</span>
                    <span className="text-gray-900 text-left">{range.value}</span>
                    </div>
                ))}
                </div>
            </div>
            <div><h4 className="text-xl font-semibold text-gray-800 mb-3">تفسير النتائج</h4><p className="text-gray-600 leading-relaxed">{test.interpretation}</p></div>
        </div>
    </div>
  );
};
const ResearchModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={onClose}>
            <div dir="rtl" className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700"><X size={24} /></button>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full"><GraduationCap className="w-8 h-8 text-blue-600" /></div>
                    <h3 className="text-2xl font-bold text-blue-800">قسم أبحاث التخرج والمقالات</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">هذا القسم مخصص لعرض ومشاركة أبحاث التخرج والمقالات العلمية الهامة في مجال المختبرات الطبية. يهدف إلى أن يكون مصدراً ملهماً للطلاب والباحثين للاطلاع على أحدث الدراسات والمواضيع البحثية في اليمن والوطن العربي.</p>
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50"><h4 className="font-bold text-lg text-gray-800">دراسة حول انتشار فقر الدم بعوز الحديد لدى الأطفال في اليمن</h4><p className="text-sm text-gray-500 mt-1">الباحث: د. أحمد قاسم | تاريخ النشر: 2023</p></div>
                    <div className="p-4 border rounded-lg bg-gray-50"><h4 className="font-bold text-lg text-gray-800">تقييم دقة اختبارات التشخيص السريع للملاريا في المناطق الموبوءة</h4><p className="text-sm text-gray-500 mt-1">الباحث: أ. فاطمة علي | تاريخ النشر: 2022</p></div>
                    <div className="p-4 border rounded-lg bg-gray-50"><h4 className="font-bold text-lg text-gray-800">العلاقة بين مستويات فيتامين (د) وشدة الإصابة بأمراض المناعة الذاتية</h4><p className="text-sm text-gray-500 mt-1">الباحث: فريق بحثي | تاريخ النشر: 2024</p></div>
                </div>
                 <div className="mt-8 text-center"><p className="text-gray-500">سيتم إضافة المزيد من الأبحاث قريباً. للمساهمة ببحثك، يرجى التواصل مع إدارة التطبيق.</p></div>
            </div>
        </div>
    );
};
const AiAssistantModal = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([{ sender: 'ai', text: 'أهلاً بك في المساعد الذكي SAM-GIMS. أنا هنا للإجابة على جميع أسئلتك في مجال المختبرات الطبية. كيف يمكنني مساعدتك اليوم؟' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const prompt = `أنت مساعد ذكي متخصص في المختبرات الطبية. أجب على السؤال التالي بوضوح ودقة باللغة العربية. السؤال هو: "${input}"`;
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; // IMPORTANT: The developer must provide their own API key here.
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { throw new Error(`API error: ${response.statusText}`); }
            const result = await response.json();
            let aiText = "عذراً، لم أتمكن من العثور على إجابة. قد يكون هناك خطأ في الاتصال بالخدمة.";
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
                aiText = result.candidates[0].content.parts[0].text;
            }
            const aiMessage = { sender: 'ai', text: aiText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error fetching from Gemini API:", error);
            const errorMessage = { sender: 'ai', text: 'حدث خطأ أثناء محاولة الحصول على إجابة. يرجى المحاولة مرة أخرى لاحقاً.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally { setIsLoading(false); }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={onClose}>
            <div dir="rtl" className="bg-white flex flex-col p-0 rounded-2xl shadow-xl w-full max-w-2xl h-[85vh] max-h-[700px]" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-teal-400 to-blue-500 p-2 rounded-full shadow-md"><Sparkles className="w-6 h-6 text-white" /></div>
                        <h3 className="text-xl font-bold text-gray-800">SAM-GIMS</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={24} /></button>
                </header>
                <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && <div className="w-8 h-8 bg-teal-500 rounded-full flex-shrink-0"></div>}
                                <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}><p className="text-sm whitespace-pre-wrap">{msg.text}</p></div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start gap-2">
                                <div className="w-8 h-8 bg-teal-500 rounded-full flex-shrink-0"></div>
                                <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-3"><div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div></div></div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </main>
                <footer className="p-4 border-t bg-white">
                    <div className="flex items-center gap-2">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="اسأل عن أي شيء في المختبرات الطبية..." className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 transition" disabled={isLoading} />
                        <button onClick={handleSend} disabled={isLoading} className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 disabled:bg-gray-400 transition"><Send size={20} /></button>
                    </div>
                </footer>
            </div>
        </div>
    );
};
const StoreModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const digitalProducts = [
        { id: 1, title: "كتاب إلكتروني: أساسيات علم الدم", description: "شرح شامل ومبسط لأساسيات علم الدم والفحوصات المتعلقة به، مثالي للطلاب والمبتدئين.", price: "15.00 $", imageUrl: "https://placehold.co/600x400/0d9488/ffffff?text=كتاب إلكتروني" },
        { id: 2, title: "كورس فيديو: تفسير نتائج الكيمياء الحيوية", description: "سلسلة فيديوهات تعليمية تشرح كيفية تفسير نتائج فحوصات وظائف الكلى والكبد والدهون.", price: "25.00 $", imageUrl: "https://placehold.co/600x400/0284c7/ffffff?text=كورس فيديو" },
        { id: 3, title: "ملخصات جاهزة: أهم فحوصات الهرمونات", description: "مجموعة من الملخصات والخرائط الذهنية المركزة لمساعدتك على مراجعة فحوصات الهرمونات بسرعة وكفاءة.", price: "9.99 $", imageUrl: "https://placehold.co/600x400/be123c/ffffff?text=ملخصات" },
    ];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={onClose}>
            <div dir="rtl" className="bg-gray-50 p-6 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700"><X size={24} /></button>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-green-100 p-3 rounded-full"><ShoppingCart className="w-8 h-8 text-green-600" /></div>
                    <h3 className="text-2xl font-bold text-gray-800">المتجر الرقمي الطبي</h3>
                </div>
                <p className="text-gray-600 mb-8">تصفح مجموعتنا المختارة من المنتجات الرقمية التي ستساعدك في رحلتك التعليمية والمهنية في عالم المختبرات الطبية.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {digitalProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                            <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover" />
                            <div className="p-4 flex flex-col flex-grow">
                                <h4 className="font-bold text-lg text-gray-800">{product.title}</h4>
                                <p className="text-sm text-gray-600 mt-2 flex-grow">{product.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xl font-bold text-teal-600">{product.price}</span>
                                    <button className="bg-teal-500 text-white font-bold py-2 px-4 rounded-full hover:bg-teal-600 transition-colors">شراء الآن</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedTest, setSelectedTest] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const categories = useMemo(() => ['الكل', ...new Set(labTestsData.map(test => test.category))], []);
  const filteredTests = useMemo(() => {
    return labTestsData
      .filter(test => selectedCategory === 'الكل' || test.category === selectedCategory)
      .filter(test => test.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, selectedCategory]);
  const handleTestClick = (test) => {
    setSelectedTest(test);
    if(window.innerWidth < 1024) { setIsSidebarOpen(false); }
  };
  const TestCard = ({test}) => (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200" onClick={() => handleTestClick(test)}>
        <h4 className="font-bold text-teal-800">{test.name}</h4>
        <p className="text-sm text-gray-500 mt-1">{test.category}</p>
    </div>
  );
  return (
    <div dir="rtl" className="bg-slate-50 min-h-screen font-sans text-gray-800" style={{'--tw-bg-opacity': 1, backgroundColor: 'rgba(240, 244, 248, var(--tw-bg-opacity))'}}>
      <div className="container mx-auto p-4 sm:p-6">
        <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                 <div className="bg-teal-500 p-3 rounded-xl shadow-md"><Beaker className="w-7 h-7 text-white" /></div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-teal-800">Sam MedLab</h1>
                    <p className="text-md text-gray-500 -mt-1">REFERENCE</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setIsStoreModalOpen(true)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" title="المتجر الرقمي"><ShoppingCart className="w-6 h-6 text-green-600" /></button>
                <button onClick={() => setIsAiModalOpen(true)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" title="المساعد الذكي SAM-GIMS"><Sparkles className="w-6 h-6 text-teal-500" /></button>
                <button onClick={() => setIsResearchModalOpen(true)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" title="أبحاث التخرج"><GraduationCap className="w-6 h-6 text-gray-600" /></button>
                <button className="lg:hidden p-2 rounded-md hover:bg-gray-200" onClick={() => setIsSidebarOpen(true)}><MenuIcon className="w-6 h-6" /></button>
            </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className={`lg:col-span-3 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed top-0 right-0 h-full w-80 bg-white p-6 shadow-lg z-40 lg:static lg:w-auto lg:h-auto lg:shadow-none lg:bg-transparent lg:p-0`}>
              <div className="flex justify-between items-center lg:hidden mb-6">
                  <h2 className="text-xl font-bold text-teal-700">الأقسام والفلاتر</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2"><X /></button>
              </div>
              <div className="relative mb-6">
                  <input type="text" placeholder="ابحث عن فحص..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">الأقسام</h3>
                  <div className="space-y-2">
                      {categories.map(category => (
                          <button key={category} onClick={() => setSelectedCategory(category)} className={`w-full text-right flex items-center p-3 rounded-lg transition-all duration-200 ${selectedCategory === category ? 'bg-teal-500 text-white shadow' : 'hover:bg-teal-100 hover:text-teal-800'}`}>
                              {categoryIcons[category]}
                              <span className="font-medium">{category}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </aside>
          {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
          <main className="lg:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredTests.length > 0 ? (
                      filteredTests.map(test => <TestCard key={test.id} test={test} />)
                  ) : (
                      <p className="text-center text-gray-500 mt-4 col-span-full">لا توجد نتائج مطابقة</p>
                  )}
              </div>
          </main>
        </div>
      </div>
      {selectedTest && <TestDetailView test={selectedTest} onClose={() => setSelectedTest(null)} />}
      <ResearchModal isOpen={isResearchModalOpen} onClose={() => setIsResearchModalOpen(false)} />
      <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <StoreModal isOpen={isStoreModalOpen} onClose={() => setIsStoreModalOpen(false)} />
    </div>
  );
}

// --- Helper Components ---
const MenuIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

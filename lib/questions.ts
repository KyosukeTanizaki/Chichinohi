// 30問の構造設計
// Phase 1（1-8問）: 事実の層 - 答えやすい、父が慣れてくる
// Phase 2（9-20問）: 感情の層 - 「こんなこと聞かれると思ってなかった」
// Phase 3（21-30問）: 子への層 - 子への言葉を引き出す

export type QuestionPhase = 'fact' | 'emotion' | 'child'

export type BaseQuestion = {
  day: number
  phase: QuestionPhase
  question: string
  category: string
}

export const BASE_QUESTIONS: BaseQuestion[] = [
  // Phase 1: 事実の層
  { day: 1, phase: 'fact', category: '出生・故郷', question: '生まれた場所と、子供のころに一番好きだった場所を教えてください。' },
  { day: 2, phase: 'fact', category: '夢', question: '子供のころ、将来なりたかったものは何でしたか？' },
  { day: 3, phase: 'fact', category: '学生時代', question: '学生時代、一番熱中したことは何ですか？' },
  { day: 4, phase: 'fact', category: '初仕事', question: '初めてのアルバイトや仕事は何でしたか？そのときの気持ちも教えてください。' },
  { day: 5, phase: 'fact', category: '転機', question: '人生で「大人になった」と初めて感じた瞬間はいつでしたか？' },
  { day: 6, phase: 'fact', category: '好きなもの', question: '20代のころ、一番好きだった音楽・映画・本は何ですか？' },
  { day: 7, phase: 'fact', category: '友人', question: '今でも連絡を取り合っている、昔からの友人はいますか？その人とのエピソードを教えてください。' },
  { day: 8, phase: 'fact', category: '場所', question: 'いつかまた行きたいと思っている場所はありますか？その理由も聞かせてください。' },

  // Phase 2: 感情の層
  { day: 9, phase: 'emotion', category: '失敗', question: '人生で一番大きな失敗と、そこから学んだことを教えてください。' },
  { day: 10, phase: 'emotion', category: '叱られた', question: '誰かに怒鳴られたり、強く叱られたりして、今でも覚えている出来事はありますか？' },
  { day: 11, phase: 'emotion', category: '嬉しかった', question: '仕事や人生で、一番「やって良かった」と思えた瞬間はいつですか？' },
  { day: 12, phase: 'emotion', category: '後悔', question: 'もう少し早くやっておけばよかったと思うことはありますか？' },
  { day: 13, phase: 'emotion', category: '感謝', question: '誰かへの感謝を、伝えられないまま終わってしまったことはありますか？' },
  { day: 14, phase: 'emotion', category: '涙', question: '大人になってから、涙が出るほど感動した・悲しかった出来事を教えてください。' },
  { day: 15, phase: 'emotion', category: '誇り', question: '自分の人生の中で、最も誇りに思っていることは何ですか？' },
  { day: 16, phase: 'emotion', category: '恐怖', question: '人生で一番怖かった経験と、それをどう乗り越えたかを教えてください。' },
  { day: 17, phase: 'emotion', category: 'ターニングポイント', question: '誰かに言われた言葉で、今でも心に残っているものはありますか？' },
  { day: 18, phase: 'emotion', category: '仕事観', question: '仕事をする上で、ずっと大切にしてきた信念や考え方はありますか？' },
  { day: 19, phase: 'emotion', category: '変化', question: '自分が一番変わったと思うのは、いつ・何がきっかけでしたか？' },
  { day: 20, phase: 'emotion', category: '秘密', question: '家族にはあまり話したことのない、あなたの「意外な一面」はありますか？' },

  // Phase 3: 子への層
  { day: 21, phase: 'child', category: '父になった瞬間', question: '「自分は父親になった」と初めて実感した瞬間を教えてください。' },
  { day: 22, phase: 'child', category: '子への想い', question: '子供が生まれた日の夜、どんなことを考えていましたか？' },
  { day: 23, phase: 'child', category: '見せたくなかった姿', question: '子供に見せたくなかった、あるいは見られて恥ずかしかった自分の姿はありますか？' },
  { day: 24, phase: 'child', category: '伝えたいこと', question: '子供に伝えたいけれど、照れくさくて言えていないことはありますか？' },
  { day: 25, phase: 'child', category: '自分の親', question: 'あなた自身の父（または母）から受け継いだと思う部分は何ですか？' },
  { day: 26, phase: 'child', category: '20歳に戻ったら', question: 'もう一度20歳に戻れたら、最初にやることは何ですか？' },
  { day: 27, phase: 'child', category: '人生の意味', question: 'あなたにとって、生きることの意味とは何だと思いますか？' },
  { day: 28, phase: 'child', category: '老い', question: '年を重ねることで、良くなったと感じることはありますか？' },
  { day: 29, phase: 'child', category: '願い', question: '子供の人生に、ひとつだけ願いを込めるとしたら何を願いますか？' },
  { day: 30, phase: 'child', category: '最後の言葉', question: '最後に、子供へのメッセージを自由に話してください。これだけは音声でお願いします。' },
]

// 今日の質問を取得（セッション開始日から何日経過したか）
export function getQuestionForDay(dayNumber: number): BaseQuestion | null {
  return BASE_QUESTIONS.find(q => q.day === dayNumber) ?? null
}

// フォールバック用：AIが生成できない場合のデフォルト質問
export function getDefaultQuestion(dayNumber: number): string {
  const q = getQuestionForDay(dayNumber)
  return q?.question ?? '今日のあなたの気持ちや、最近あったことを自由に話してください。'
}

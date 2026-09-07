// Retrieval-Augmented Generation (RAG) Knowledge Base
// Sathaye Autonomous College Official Ordinances & Regulatory Corpus

export interface RAGChunk {
  id: string;
  docTitle: string;
  section: string;
  ordinanceRef?: string;
  content: string;
  keywords: string[];
}

export interface RAGSearchResult {
  answer: string;
  citations: {
    docTitle: string;
    section: string;
    ordinanceRef?: string;
    matchedSnippet: string;
    confidenceScore: number;
  }[];
}

export const OFFICIAL_CAMPUS_DOCS: RAGChunk[] = [
  {
    id: 'rag-atkt-01',
    docTitle: 'Sathaye Autonomous Academic & Examination Ordinance 2026',
    section: 'Section 4.2: ATKT & Progression Criteria',
    ordinanceRef: 'Autonomous Reg. 4.2(B)',
    content: 'A student is eligible for progression to Semester V only if they have passed all courses of Semester I and II, and have no more than 2 ATKTs (Allowed To Keep Terms) pending across Semester III and IV. Re-examinations are held within 30 days of result declarations.',
    keywords: ['atkt', 'fail', 'kt', 'progression', 'exam', 'semester', 're-exam', 'pass']
  },
  {
    id: 'rag-grading-02',
    docTitle: 'Sathaye Autonomous Academic & Examination Ordinance 2026',
    section: 'Section 5.1: 10-Point Grading Scale & Honors Classification',
    ordinanceRef: 'Autonomous Reg. 5.1(A)',
    content: 'Academic performance is evaluated on a 10-point scale: Grade O (Outstanding: >= 80%), Grade A+ (Excellent: 70-79.9%), Grade A (Very Good: 60-69.9%), Grade B+ (Good: 55-59.9%), Grade B (Above Average: 50-54.9%), Grade C (Pass: 40-49.9%), Grade F (Fail: < 40%). CGPA >= 8.5 with zero ATKTs qualifies for Autonomous Honors Degree.',
    keywords: ['grading', 'marks', 'cgpa', 'sgpa', 'percentage', 'grade o', 'honors', 'scale']
  },
  {
    id: 'rag-attendance-03',
    docTitle: 'University & Autonomous Attendance Regulation Manual',
    section: 'Section 2.4: 75% Attendance Compliance & Medical Condonation',
    ordinanceRef: 'University Ordinance 6086',
    content: 'Under University Ordinance 6086, a minimum aggregate attendance of 75% across all scheduled lectures, tutorials, and practicals is compulsory to be eligible for end-semester examinations. A condonation between 50% and 74% may be granted strictly by the Principal upon timely submission of certified medical certificates or university sports representation letters within 7 days of absence.',
    keywords: ['attendance', '75%', 'hall ticket', 'defaulter', 'medical', 'leave', 'condonation', 'ordinance 6086']
  },
  {
    id: 'rag-placement-04',
    docTitle: 'Sathaye Autonomous Training & Placement Cell Guidelines 2026',
    section: 'Section 3.1: Drive Eligibility & Dream Company Upgrades',
    ordinanceRef: 'Placement Policy 2026',
    content: 'Students with CGPA >= 7.0 and zero active backlogs are eligible for Day-1 tier recruitment drives. Sathaye operates a Dream Job Upgrade Policy: any student securing an offer may continue to appear for premium drives if the new CTC is at least 40% higher than their existing offer. Verifiable credentials from the Blockchain Vault are required during background screening.',
    keywords: ['placement', 'job', 'recruiter', 'ctc', 'package', 'dream job', 'eligibility', 'interview', 'tcs', 'morgan stanley']
  },
  {
    id: 'rag-canteen-05',
    docTitle: 'Smart Campus Canteen & Meal Tokens Protocol',
    section: 'Section 1.3: Token Validity & Cancellation Rules',
    ordinanceRef: 'Canteen SOP 2026',
    content: 'Meal QR tokens generated via Sathaye UCM are valid for 3 hours from issuance. Token cancellation and 100% instant wallet refund is permitted within 5 minutes of order placement provided the food preparation status is still PENDING. Handover requires dual scan at counter terminal.',
    keywords: ['canteen', 'token', 'meal', 'order', 'refund', 'cancellation', 'qr', 'food', 'pickup']
  },
  {
    id: 'rag-library-06',
    docTitle: 'Sathaye Autonomous Central Library & Book Bank Charter',
    section: 'Section 4.0: Borrowing Limits & Overdue Rules',
    ordinanceRef: 'Library Circular 12/2026',
    content: 'Undergraduate students may borrow up to 3 physical volumes simultaneously for a period of 14 days, renewable once online if no hold exists. Overdue fines are ₹2 per day per book. E-books and IEEE/ACM digital access are accessible 24x7 via College VPN credentials.',
    keywords: ['library', 'books', 'borrow', 'fine', 'return', 'renew', 'journal', 'digital library']
  },
  {
    id: 'rag-safety-07',
    docTitle: 'Campus Safety, Anti-Ragging & Emergency Standard Operating Procedure',
    section: 'Section 1.1: Zero-Tolerance Anti-Ragging Mandate',
    ordinanceRef: 'UGC Ragging Prevention Reg. 2009',
    content: 'Sathaye Autonomous College maintains zero tolerance for ragging, bullying, or harassment. In-App SOS triggers an immediate siren at Gate 1 security desk with live GPS location telemetry. National Anti-Ragging 24x7 Helpline is 1800-180-5522. Security command desk direct line: +91 22 2618 3614.',
    keywords: ['safety', 'sos', 'ragging', 'emergency', 'security', 'police', 'medical', 'complaint']
  }
];

export class RAGKnowledgeEngine {
  private corpus: RAGChunk[] = [...OFFICIAL_CAMPUS_DOCS];

  search(query: string): RAGSearchResult {
    const cleanQuery = query.toLowerCase().trim();
    const queryTokens = cleanQuery.split(/[\s,?.!]+/).filter(Boolean);

    // Score chunks by keyword and token matches
    const scoredChunks = this.corpus.map(chunk => {
      let score = 0;
      const lowerContent = chunk.content.toLowerCase();
      const lowerTitle = chunk.docTitle.toLowerCase();
      const lowerSection = chunk.section.toLowerCase();

      // Keyword hits (high weight)
      chunk.keywords.forEach(kw => {
        if (cleanQuery.includes(kw)) {
          score += 15;
        }
      });

      // Query token hits
      queryTokens.forEach(token => {
        if (token.length > 2) {
          if (lowerContent.includes(token)) score += 5;
          if (lowerTitle.includes(token)) score += 8;
          if (lowerSection.includes(token)) score += 10;
        }
      });

      return { chunk, score };
    });

    scoredChunks.sort((a, b) => b.score - a.score);
    const topMatches = scoredChunks.filter(s => s.score > 0).slice(0, 2);

    if (topMatches.length === 0) {
      return {
        answer: "I consulted Sathaye Autonomous College's official ordinances, but couldn't locate an exact regulatory section for that inquiry. You can ask me about ATKT rules, 75% attendance criteria, grading scales, campus placement drives, canteen meal tokens, or library borrowing limits.",
        citations: []
      };
    }

    const best = topMatches[0].chunk;
    return {
      answer: best.content,
      citations: topMatches.map(m => ({
        docTitle: m.chunk.docTitle,
        section: m.chunk.section,
        ordinanceRef: m.chunk.ordinanceRef,
        matchedSnippet: m.chunk.content,
        confidenceScore: Math.min(99, Math.max(78, m.score * 3))
      }))
    };
  }
}

export const ragKnowledgeEngine = new RAGKnowledgeEngine();

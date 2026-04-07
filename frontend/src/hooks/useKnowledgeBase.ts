/**
 * Hook to access medical knowledge base
 * Provides type-safe access to autism education content
 */

import { useMemo } from 'react';

// Inline the knowledge base to avoid JSON import issues
const knowledgeBaseContent = {
  diagnostic_criteria: {
    title: 'Understanding Autism Spectrum Disorder (ASD) Diagnosis',
    overview:
      'Autism Spectrum Disorder is a lifelong neurodevelopmental condition characterized by persistent differences in social communication and the presence of restricted, repetitive behaviors and interests. Diagnosis typically occurs in early childhood but can occur at any age.',
  },
  faq: [
    {
      question: 'What causes autism?',
      answer:
        'Autism results from differences in brain structure and function that emerge during prenatal development. While the exact causes aren\'t fully understood, research shows both genetic and environmental factors influence autism development. No evidence supports vaccines, parenting style, or trauma as causes—these misconceptions have been disproven by extensive research.',
    },
    {
      question: 'Can autism be prevented or cured?',
      answer:
        'No. Autism is a lifelong neurological difference, not a disease. While various therapies and supports can help autistic individuals develop skills and manage challenges, the fundamental difference in neurology remains. Many autistic advocates argue that "curing" autism would mean changing a core aspect of identity. The focus should be on support and acceptance, not cure.',
    },
    {
      question: 'Should I be worried if my child\'s gene expression shows autism patterns?',
      answer:
        'Not necessarily. Many children with "autism-typical" gene expression patterns are developing typically. Genes influence risk but don\'t determine outcomes. Environmental factors, opportunities, and support systems matter significantly. If you have developmental concerns, professional evaluation is important—but a screening result alone isn\'t diagnostic.',
    },
    {
      question: 'Does intelligence relate to autism?',
      answer:
        'Autism and intelligence are independent. Autistic people span the entire range of intelligence, from intellectual disability to exceptional cognitive abilities. Some autistic people have remarkable talents in specific areas while struggling with other tasks (uneven cognitive profile). Intelligence testing may not accurately measure autistic individuals\' abilities due to differences in processing and communication style.',
    },
    {
      question: 'Is autism more common in boys or girls?',
      answer:
        'Autism is diagnosed 3-4 times more often in males than females, but this may reflect diagnostic bias rather than true prevalence rates. Girls, especially high-functioning autistic girls, are frequently missed or diagnosed later. Girls may "mask" or camouflage autistic traits to fit in socially. More research into recognition of autism in girls and women is ongoing.',
    },
    {
      question: 'What does this gene expression test actually measure?',
      answer:
        'This tool analyzes RNA expression levels (how actively genes are being used) in tissue samples. It doesn\'t sequence your DNA or diagnose autism—it identifies patterns in gene activity that correlate with autism in research populations. Think of it as pattern recognition rather than genetic testing. It\'s a research tool, not a clinical diagnostic test.',
    },
    {
      question: 'If my sibling has autism, am I at higher risk?',
      answer:
        'Yes, siblings of autistic individuals have approximately 15-20% chance of autism, compared to ~2% in general population. However, this still means 80%+ of siblings are not autistic. Genetic risk is one factor; other factors also matter. If you have concerns about yourself, professional evaluation can provide clarity.',
    },
    {
      question: 'Can autism be detected during pregnancy?',
      answer:
        'Current prenatal testing cannot diagnose autism. Some genetic conditions associated with autism (like certain PTEN or SCN1A variants) can be identified through genetic counseling and testing, but this is different from autism diagnosis, which requires behavioral assessment. No prenatal test "predicts" autism reliably.',
    },
    {
      question: 'What support and treatments help autistic people?',
      answer:
        'Effective approaches include: early intervention services (speech, occupational, physical therapy), special education support (if needed), behavioral strategies tailored to the individual, accommodations in work/school environments, therapy for co-occurring anxiety or depression, and acceptance-based approaches that build on strengths. Applied Behavior Analysis (ABA) is controversial in the autism community due to historical harm; modern therapies increasingly use neurodiversity-affirming approaches.',
    },
    {
      question: 'Can autism develop later in childhood or adulthood?',
      answer:
        'Autism is present from birth and is a lifelong condition. What changes is visibility—autism may become more obvious when social demands increase (school entry, puberty, workplace). Some people recognize they\'re autistic in adulthood after learning more about autism, especially if they were previously undiagnosed. This is not new-onset autism but newly recognized.',
    },
    {
      question: 'Is autism associated with other conditions?',
      answer:
        'Some medical and mental health conditions occur more frequently in autistic populations, including: ADHD, anxiety, depression, sleep disorders, sensory processing differences, gastrointestinal issues, and epilepsy. These are not caused by autism but often co-occur. Support should address both autism and any co-occurring conditions.',
    },
    {
      question: 'What does it mean to be "high-functioning" vs. "low-functioning" autism?',
      answer:
        'These terms are outdated and often harmful. Autism exists on dimensions, not a linear spectrum from "mild" to "severe." An autistic person might have minimal support needs in some areas but substantial support needs in others. Modern understanding prefers assessing support needs in specific areas rather than applying general labels. Self-identified autistic people often dislike these terms.',
    },
    {
      question: 'Can I request this gene expression test from my doctor?',
      answer:
        'This tool is research-grade, not a clinical diagnostic test. Clinical genetic testing is available through genetic counselors and medical geneticists, typically if there\'s concern about specific genetic syndromes or cancer risk. However, genetic testing alone cannot diagnose autism—clinical assessment is always necessary.',
    },
    {
      question: 'What\'s the difference between this screening and official diagnosis?',
      answer:
        'This tool identifies patterns in gene expression correlated with autism. Official diagnosis requires: comprehensive developmental history, observation by specialists, assessment of social communication and repetitive behaviors, and evaluation to rule out other conditions. Gene expression screening is one type of research data—diagnosis requires clinical evaluation. Always seek professional assessment.',
    },
    {
      question: 'Are there treatments that "correct" the genetic issues in autism?',
      answer:
        'Currently, no. Gene therapy approaches are in very early research stages and not yet clinically available. Given that autism involves differences in fundamental brain structure and function, "correcting" genetics would be ethically complex. The ethical frame is increasingly shifting toward supporting autistic individuals\' wellbeing rather than attempting to eliminate autism.',
    },
  ],
};

export const useKnowledgeBase = () => {
  const faqItems = useMemo(() => {
    const medicalFaqs = knowledgeBaseContent.faq.map((item, index) => ({
      id: `medical-${index}`,
      category: 'Medical & Scientific',
      question: item.question,
      answer: item.answer,
    }));

    return medicalFaqs;
  }, []);

  return {
    faq: knowledgeBaseContent.faq,
    faqItems,
    diagnosticCriteria: knowledgeBaseContent.diagnostic_criteria,
  };
};

export default useKnowledgeBase;

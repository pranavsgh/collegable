import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.ingest import ingest_document
from dotenv import load_dotenv
load_dotenv()

resources = [
    {
        "source": "activity-list-guide",
        "text": """
        Extracurriculars are integral to giving Admissions Officers more complete ideas about your interests and personality.
        Activity types are categorized as Common, Uncommon, Rare, and Scarce.
        Common activities include playing in the school band, volunteering, or joining a language club.
        Uncommon activities involve leadership roles or specific honors.
        Rare activities help you shine because many high-schoolers have not participated in them.
        Scarce activities signify huge accomplishments like national awards or selective internships.
        Quality over quantity. Make sure every activity has been a sincere effort.
        Activity descriptions for the Common App require a maximum of 150 characters.
        Use strong and varied verbs. Do not use the same verb more than once.
        Start each phrase with strong action verbs like organized, founded, led, created, managed, coordinated.
        Freshman Year is the time to explore clubs and interests and volunteer.
        Sophomore Year narrow your focus and potentially start your own club or organization.
        Junior Year continue seeking leadership opportunities in clubs you are already part of.
        Senior Year maintain involvement in clubs you are most passionate about and build leadership.
        Never stretch the truth or lie on your activities list. Dishonesty can result in rescinded admissions.
        List awards in order of importance. Specify what each award means and emphasize selectivity.
        """
    },
    {
        "source": "college-essay-guide",
        "text": """
        College essays are one of the most important parts of your application beyond grades and test scores.
        The Common App personal statement is 650 words and is required by most colleges.
        There are seven Common App essay prompts. Choose the one that best fits your story.
        The best college essays are specific, personal, and tell a story rather than list accomplishments.
        Avoid overly common topics like sports injuries, winning a big game, or mission trips.
        Start writing your personal statement in the summer before your senior year.
        Have at least three people read and give feedback on your essay before submitting.
        Supplemental essays are shorter essays required by specific colleges beyond the Common App.
        College Essay Guy at collegeessayguy.com provides free resources for writing college essays.
        Use the BBs exercise to generate content: list what you did, problems you solved, lessons learned, and impact.
        Use a values scan to review your activity descriptions and identify what values come through.
        Reveal not only your commitment to activities but also how well you led, worked, or communicated.
        Illustrate how an activity has changed you and transformed your skillset.
        """
    },
    {
        "source": "fafsa-financial-aid",
        "text": """
        FAFSA stands for Free Application for Federal Student Aid.
        Every student should fill out the FAFSA in their senior year of high school.
        The FAFSA opens on October 1st each year. Filing early increases your chances of getting aid.
        You will need your parents tax returns, social security number, and bank statements.
        The Expected Family Contribution EFC determines how much financial aid you receive.
        Students from families earning under 60000 dollars per year often qualify for Pell Grants.
        The maximum Pell Grant for 2024-2025 is 7395 dollars per year.
        File FAFSA at studentaid.gov. It is completely free to apply.
        Financial aid comes in four forms: grants, scholarships, work-study, and loans.
        Grants and scholarships are free money you do not have to repay.
        Loans must be repaid with interest and should be borrowed only as a last resort.
        Federal student loans have lower interest rates than private loans.
        Always compare financial aid award letters from multiple colleges before deciding.
        You can appeal a financial aid award if your family circumstances have changed.
        """
    },
    {
        "source": "college-application-timeline",
        "text": """
        9th grade focus on getting good grades and exploring extracurricular activities.
        Start building relationships with teachers who may write recommendation letters later.
        10th grade take the PSAT for practice and start researching colleges.
        Join clubs and take on leadership roles in 10th grade. Consider AP or IB courses.
        11th grade take the SAT or ACT in the spring. Build your college list.
        Request letters of recommendation from teachers in 11th grade.
        Start drafting your personal statement in the summer before senior year.
        Create a Common App account at commonapp.org in 11th grade.
        Research scholarships actively starting in 11th grade.
        12th grade submit FAFSA on October 1st as soon as it opens.
        Submit early decision or early action applications by November deadlines.
        Submit regular decision applications by January deadlines.
        Compare financial aid award letters carefully before your final decision.
        Commit to your chosen school by May 1st National Decision Day.
        A balanced college list should include safety, match, and reach schools.
        Apply to at least two safety schools to ensure you have guaranteed options.
        """
    },
    {
        "source": "first-gen-student-guide",
        "text": """
        First generation college students are students whose parents did not attend a four year college.
        About 33 percent of all college students are first generation students.
        First generation students often face unique challenges including lack of guidance and financial stress.
        Many colleges have dedicated first generation student programs and support offices.
        TRIO programs funded by the federal government provide free support for first generation students.
        Upward Bound is a TRIO program that helps first gen students prepare for college.
        QuestBridge is a scholarship program that connects low-income students with top colleges.
        College Possible and College Advising Corps provide free college counseling for first gen students.
        Do not be afraid to ask for help. College admissions offices have counselors who want to help you.
        Being first generation is something to be proud of on your college application.
        Part time jobs and family responsibilities count as activities on your application.
        Every student has activities to list even if they have not been in formal clubs.
        """
    },
    {
        "source": "scholarship-guide",
        "text": """
        Scholarships are free money for college that you do not have to pay back.
        Start searching for scholarships in 9th or 10th grade to get ahead.
        Fastweb at fastweb.com is a free scholarship search engine with over 1.5 million scholarships.
        The Gates Scholarship is for exceptional minority students with financial need.
        QuestBridge connects low-income students with top colleges through scholarships.
        Many local organizations including community foundations and employers offer scholarships.
        Apply for as many scholarships as possible even small ones add up.
        Never pay money to apply for a scholarship. Legitimate scholarships are always free.
        Write strong personal essays and tailor them to each scholarship application.
        """
    },
    {
        "source": "sat-act-guide",
        "text": """
        The SAT and ACT are standardized tests used for college admissions.
        Most students take the SAT or ACT in the spring of their junior year.
        The SAT has two sections: Evidence-Based Reading and Writing, and Math.
        The maximum SAT score is 1600. A score above 1200 is considered competitive.
        The ACT has four sections: English, Math, Reading, and Science.
        The maximum ACT score is 36. A score above 24 is considered competitive.
        Khan Academy offers free official SAT prep at khanacademy.org/sat.
        You can take the SAT or ACT multiple times and submit your best score.
        Many colleges are now test-optional meaning you do not have to submit scores.
        Start SAT or ACT prep at least 6 months before your planned test date.
        Consistent daily practice leads to meaningful score improvements.
        """
    }
]

if __name__ == "__main__":
    print("Starting ingestion...")
    for r in resources:
        ingest_document(r["text"], r["source"])
    print("All resources ingested successfully!")
